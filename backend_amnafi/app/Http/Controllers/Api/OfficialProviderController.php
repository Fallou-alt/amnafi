<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\Mission;
use App\Models\ServiceReview;
use Illuminate\Http\Request;

class OfficialProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = Provider::where('is_active', true)
            ->where('is_official', true)
            ->with(['user:id,name,phone', 'category:id,name,icon,color']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_partner')) {
            $query->where('is_partner', true);
        }

        $providers = $query->orderBy('is_partner', 'desc')
            ->orderBy('service_rating', 'desc')
            ->orderBy('rating', 'desc')
            ->paginate(12);

        $providers->getCollection()->transform(function ($provider) {
            $provider->profile_photo_url = $provider->profile_photo ? 
                url('storage/' . $provider->profile_photo) : null;
            $provider->cover_photo_url = $provider->cover_photo ? 
                url('storage/' . $provider->cover_photo) : null;
            $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);
            return $provider;
        });

        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function show($id)
    {
        $provider = Provider::where('is_official', true)
            ->with(['user', 'category'])
            ->findOrFail($id);

        $provider->profile_photo_url = $provider->profile_photo ? 
            url('storage/' . $provider->profile_photo) : null;
        $provider->cover_photo_url = $provider->cover_photo ? 
            url('storage/' . $provider->cover_photo) : null;
        $provider->whatsapp_url = 'https://wa.me/' . preg_replace('/[^0-9]/', '', $provider->phone);

        $reviews = ServiceReview::where('provider_id', $id)
            ->with('user:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'provider' => $provider,
                'reviews' => $reviews
            ]
        ]);
    }

    public function createMission(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'preferred_date' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0'
        ]);

        $validated['user_id'] = auth()->id();

        $mission = Mission::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Mission créée avec succès',
            'data' => $mission
        ], 201);
    }

    public function addReview(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'mission_id' => 'nullable|exists:missions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $validated['user_id'] = auth()->id();

        $review = ServiceReview::create($validated);

        // Mettre à jour la note moyenne du prestataire
        $provider = Provider::find($validated['provider_id']);
        $avgRating = ServiceReview::where('provider_id', $validated['provider_id'])->avg('rating');
        $reviewCount = ServiceReview::where('provider_id', $validated['provider_id'])->count();

        $provider->update([
            'service_rating' => round($avgRating, 2),
            'service_reviews_count' => $reviewCount
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avis ajouté avec succès',
            'data' => $review
        ], 201);
    }
}
