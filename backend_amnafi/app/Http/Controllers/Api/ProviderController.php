<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = Provider::where('is_active', true)
            ->with(['user', 'activeServices', 'reviews', 'category']);

        // Recherche globale par nom, métier, catégorie
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('business_name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Filtrage par catégorie
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filtrage par ville
        if ($request->has('city')) {
            $query->where('city', 'LIKE', "%{$request->city}%");
        }

        // Filtrage par note
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Prestataires vérifiés
        if ($request->has('verified') && $request->verified) {
            $query->where('is_verified', true);
        }

        // Prestataires premium
        if ($request->has('premium') && $request->premium) {
            $query->where('is_premium', true)
                  ->where(function($q) {
                      $q->whereNull('subscription_expires_at')
                        ->orWhere('subscription_expires_at', '>', now());
                  });
        }

        // Tri (premium en premier)
        $sortBy = $request->get('sort_by', 'rating');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['rating', 'reviews_count', 'services_count', 'business_name'])) {
            $query->orderBy('is_premium', 'desc')
                  ->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('is_premium', 'desc')
                  ->orderBy('is_verified', 'desc')
                  ->orderBy('rating', 'desc')
                  ->orderBy('business_name', 'asc');
        }

        $providers = $query->paginate($request->get('per_page', 12));

        // Ajouter les informations d'abonnement et URL photo
        $providers->getCollection()->transform(function ($provider) {
            $provider->subscription_info = [
                'is_premium' => $provider->isPremium(),
                'subscription_type' => $provider->subscription_type,
                'expires_at' => $provider->subscription_expires_at,
                'badge_visible' => $provider->isPremium()
            ];
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function show(Provider $provider)
    {
        if (!$provider->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Provider not found'
            ], 404);
        }

        $provider->load([
            'user',
            'activeServices' => function ($query) {
                $query->with('category')
                      ->orderBy('is_featured', 'desc')
                      ->orderBy('rating', 'desc')
                      ->limit(6);
            },
            'reviews' => function ($query) {
                $query->with('user')
                      ->orderBy('created_at', 'desc')
                      ->limit(10);
            }
        ]);

        return response()->json([
            'success' => true,
            'data' => $provider
        ]);
    }

    public function verified()
    {
        $providers = Provider::where('is_active', true)
            ->where('is_verified', true)
            ->with(['user', 'activeServices', 'category'])
            ->orderBy('rating', 'desc')
            ->limit(8)
            ->get();

        $providers->transform(function ($provider) {
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function topRated()
    {
        $providers = Provider::where('is_active', true)
            ->where('reviews_count', '>=', 3)
            ->with(['user', 'activeServices', 'category'])
            ->orderBy('rating', 'desc')
            ->orderBy('reviews_count', 'desc')
            ->limit(8)
            ->get();

        $providers->transform(function ($provider) {
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function byCategory($categoryId)
    {
        $providers = Provider::where('is_active', true)
            ->where('category_id', $categoryId)
            ->with(['user', 'category'])
            ->orderBy('is_premium', 'desc')
            ->orderBy('is_verified', 'desc')
            ->orderBy('rating', 'desc')
            ->get();

        // Ajouter les URLs et informations supplémentaires
        $providers->transform(function ($provider) {
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:providers,email',
            'website' => 'nullable|url',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'user_id' => 'required|exists:users,id',
            'images' => 'array',
            'images.*' => 'url',
            'logo' => 'nullable|url'
        ]);

        $provider = Provider::create([
            'business_name' => $request->business_name,
            'slug' => \Str::slug($request->business_name),
            'description' => $request->description,
            'phone' => $request->phone,
            'email' => $request->email,
            'website' => $request->website,
            'address' => $request->address,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'user_id' => $request->user_id,
            'images' => $request->images ?? [],
            'logo' => $request->logo
        ]);

        return response()->json([
            'success' => true,
            'data' => $provider,
            'message' => 'Provider created successfully'
        ], 201);
    }

    public function update(Request $request, Provider $provider)
    {
        $request->validate([
            'business_name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:providers,email,' . $provider->id,
            'website' => 'nullable|url',
            'address' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'array',
            'images.*' => 'url',
            'logo' => 'nullable|url'
        ]);

        $provider->update($request->all());

        if ($request->has('business_name')) {
            $provider->update(['slug' => \Str::slug($request->business_name)]);
        }

        return response()->json([
            'success' => true,
            'data' => $provider,
            'message' => 'Provider updated successfully'
        ]);
    }

    public function destroy(Provider $provider)
    {
        $provider->delete();

        return response()->json([
            'success' => true,
            'message' => 'Provider deleted successfully'
        ]);
    }

    public function globalSearch(Request $request)
    {
        $search = $request->get('search', '');
        $categoryId = $request->get('category_id');
        
        $providersQuery = Provider::where('is_active', true)
            ->with(['user', 'category']);
        
        $servicesQuery = Service::where('is_active', true)
            ->with(['category', 'provider.category']);
        
        if ($search) {
            // Recherche intelligente avec tri par pertinence
            $providersQuery->where(function ($q) use ($search) {
                $q->where('business_name', 'LIKE', "{$search}%") // Commence par
                  ->orWhere('business_name', 'LIKE', "%{$search}%") // Contient
                  ->orWhere('description', 'LIKE', "{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'LIKE', "{$search}%")
                                   ->orWhere('name', 'LIKE', "%{$search}%");
                  });
            })
            ->orderByRaw("CASE 
                WHEN business_name LIKE '{$search}%' THEN 1
                WHEN category.name LIKE '{$search}%' THEN 2
                WHEN business_name LIKE '%{$search}%' THEN 3
                ELSE 4 END")
            ->leftJoin('categories as category', 'providers.category_id', '=', 'category.id');
            
            $servicesQuery->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "{$search}%")
                  ->orWhere('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'LIKE', "{$search}%")
                                   ->orWhere('name', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('provider.category', function($providerCategoryQuery) use ($search) {
                      $providerCategoryQuery->where('name', 'LIKE', "{$search}%")
                                           ->orWhere('name', 'LIKE', "%{$search}%");
                  });
            });
        }
        
        if ($categoryId) {
            $providersQuery->where('category_id', $categoryId);
            $servicesQuery->whereHas('provider', function($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }
        
        $providers = $providersQuery->orderBy('is_premium', 'desc')
            ->orderBy('rating', 'desc')
            ->limit(20)
            ->get();
            
        $services = $servicesQuery->orderBy('is_featured', 'desc')
            ->orderBy('rating', 'desc')
            ->limit(20)
            ->get();
        
        // Ajouter les URLs
        $providers->transform(function ($provider) {
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });
        
        $services->transform(function ($service) {
            if ($service->provider) {
                $service->provider->profile_photo_url = $service->provider->profile_photo ? 
                    url('storage/' . $service->provider->profile_photo) : null;
                $service->provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $service->provider->phone);
            }
            return $service;
        });
        
        // Vérifier si aucun résultat trouvé
        $noResults = $providers->isEmpty() && $services->isEmpty() && !empty($search);
        
        return response()->json([
            'success' => true,
            'data' => [
                'providers' => $providers,
                'services' => $services,
                'total_providers' => $providers->count(),
                'total_services' => $services->count(),
                'no_results' => $noResults,
                'search_term' => $search
            ]
        ]);
    }
}
