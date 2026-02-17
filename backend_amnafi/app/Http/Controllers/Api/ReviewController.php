<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Service;
use App\Models\Provider;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['user', 'service', 'provider']);

        // Filtrage par note
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Filtrage par vérification
        if ($request->has('verified') && $request->verified) {
            $query->where('is_verified', true);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['rating', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $reviews = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function serviceReviews(Service $service, Request $request)
    {
        $query = $service->reviews()->with(['user', 'provider']);

        // Filtrage par note
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Filtrage par vérification
        if ($request->has('verified') && $request->verified) {
            $query->where('is_verified', true);
        }

        $reviews = $query->orderBy('created_at', 'desc')
                        ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function providerReviews(Provider $provider, Request $request)
    {
        $query = $provider->reviews()->with(['user', 'service']);

        // Filtrage par note
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Filtrage par vérification
        if ($request->has('verified') && $request->verified) {
            $query->where('is_verified', true);
        }

        $reviews = $query->orderBy('created_at', 'desc')
                        ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string|min:10|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'service_id' => 'required|exists:services,id',
            'provider_id' => 'required|exists:providers,id'
        ]);

        // Vérifier que l'utilisateur n'a pas déjà laissé un avis pour ce service
        $existingReview = Review::where('user_id', auth()->id())
                                ->where('service_id', $request->service_id)
                                ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this service'
            ], 422);
        }

        $review = Review::create([
            'comment' => $request->comment,
            'rating' => $request->rating,
            'service_id' => $request->service_id,
            'provider_id' => $request->provider_id,
            'user_id' => auth()->id(),
            'is_verified' => false // Les avis sont vérifiés par un admin
        ]);

        $review->load(['user', 'service', 'provider']);

        return response()->json([
            'success' => true,
            'data' => $review,
            'message' => 'Review created successfully'
        ], 201);
    }

    public function update(Request $request, Review $review)
    {
        // Vérifier que l'utilisateur est le propriétaire de l'avis
        if ($review->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'comment' => 'sometimes|required|string|min:10|max:1000',
            'rating' => 'sometimes|required|integer|min:1|max:5'
        ]);

        $review->update($request->only(['comment', 'rating']));

        return response()->json([
            'success' => true,
            'data' => $review->fresh(['user', 'service', 'provider']),
            'message' => 'Review updated successfully'
        ]);
    }

    public function destroy(Review $review)
    {
        // Vérifier que l'utilisateur est le propriétaire de l'avis ou un admin
        if ($review->user_id !== auth()->id() && !auth()->user()->is_admin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }
}
