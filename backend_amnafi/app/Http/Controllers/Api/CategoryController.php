<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Service;
use App\Models\Provider;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['providers' => function($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('name')
            ->get();

        // Ajouter le nombre de prestataires pour chaque catégorie
        $categories->transform(function ($category) {
            $category->providers_count = $category->providers_count;
            return $category;
        });

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['subcategories' => function($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function subcategoryServices($categorySlug, $subcategorySlug)
    {
        $subcategory = Subcategory::where('slug', $subcategorySlug)
            ->whereHas('category', function($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->with(['category', 'services.provider'])
            ->first();

        if (!$subcategory) {
            return response()->json([
                'success' => false,
                'message' => 'Sous-catégorie non trouvée'
            ], 404);
        }

        $services = Service::where('subcategory_id', $subcategory->id)
            ->where('is_active', true)
            ->with(['provider', 'category', 'subcategory'])
            ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => [
                'subcategory' => $subcategory,
                'services' => $services
            ]
        ]);
    }

    public function providers($categoryId)
    {
        $category = Category::find($categoryId);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

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
            'data' => $providers,
            'category' => $category
        ]);
    }
}