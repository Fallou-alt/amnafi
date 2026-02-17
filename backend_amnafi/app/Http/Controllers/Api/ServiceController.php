<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::where('is_active', true)
            ->with(['category', 'provider.category', 'reviews']);

        // Recherche par titre, catégorie, métier du prestataire
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('provider.category', function($providerCategoryQuery) use ($search) {
                      $providerCategoryQuery->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Filtrage par catégorie
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filtrage par prix
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filtrage par note
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Services en vedette
        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['price', 'rating', 'views_count', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('is_featured', 'desc')
                  ->orderBy('rating', 'desc')
                  ->orderBy('created_at', 'desc');
        }

        $services = $query->paginate($request->get('per_page', 12));

        // Ajouter les informations supplémentaires
        $services->getCollection()->transform(function ($service) {
            if ($service->provider) {
                $service->provider->profile_photo_url = $service->provider->profile_photo ? 
                    url('storage/' . $service->provider->profile_photo) : null;
                $service->provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $service->provider->phone);
            }
            return $service;
        });

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    public function show(Service $service)
    {
        if (!$service->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        // Incrémenter le nombre de vues
        $service->incrementViews();

        $service->load([
            'category',
            'provider',
            'reviews' => function ($query) {
                $query->with('user')
                      ->orderBy('created_at', 'desc')
                      ->limit(10);
            }
        ]);

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    public function featured()
    {
        $services = Service::where('is_active', true)
            ->where('is_featured', true)
            ->with(['category', 'provider.category'])
            ->orderBy('rating', 'desc')
            ->limit(8)
            ->get();

        $services->transform(function ($service) {
            if ($service->provider) {
                $service->provider->profile_photo_url = $service->provider->profile_photo ? 
                    url('storage/' . $service->provider->profile_photo) : null;
                $service->provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $service->provider->phone);
            }
            return $service;
        });

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    public function popular()
    {
        $services = Service::where('is_active', true)
            ->with(['category', 'provider.category'])
            ->orderBy('views_count', 'desc')
            ->orderBy('rating', 'desc')
            ->limit(8)
            ->get();

        $services->transform(function ($service) {
            if ($service->provider) {
                $service->provider->profile_photo_url = $service->provider->profile_photo ? 
                    url('storage/' . $service->provider->profile_photo) : null;
                $service->provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $service->provider->phone);
            }
            return $service;
        });

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'price_unit' => 'string|max:10',
            'duration' => 'nullable|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'provider_id' => 'required|exists:providers,id',
            'images' => 'array',
            'images.*' => 'url'
        ]);

        $service = Service::create([
            'title' => $request->title,
            'slug' => \Str::slug($request->title),
            'description' => $request->description,
            'price' => $request->price,
            'price_unit' => $request->price_unit ?? '€',
            'duration' => $request->duration,
            'category_id' => $request->category_id,
            'provider_id' => $request->provider_id,
            'images' => $request->images ?? []
        ]);

        return response()->json([
            'success' => true,
            'data' => $service,
            'message' => 'Service created successfully'
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'price_unit' => 'string|max:10',
            'duration' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images' => 'array',
            'images.*' => 'url'
        ]);

        $service->update($request->all());

        if ($request->has('title')) {
            $service->update(['slug' => \Str::slug($request->title)]);
        }

        return response()->json([
            'success' => true,
            'data' => $service,
            'message' => 'Service updated successfully'
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }
}
