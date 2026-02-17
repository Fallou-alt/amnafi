<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = Provider::with(['user', 'category']);
        
        // Filtres
        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }
        
        if ($request->has('type')) {
            $query->where('is_premium', $request->type === 'premium');
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                               ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        $providers = $query->orderBy('created_at', 'desc')
                          ->paginate($request->get('per_page', 15));
        
        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    public function show($id)
    {
        $provider = Provider::with(['user', 'category', 'services', 'reviews.user'])
                           ->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $provider
        ]);
    }

    public function toggleStatus(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        $provider->update(['is_active' => !$provider->is_active]);
        
        return response()->json([
            'success' => true,
            'message' => $provider->is_active ? 'Prestataire activé' : 'Prestataire désactivé',
            'data' => ['is_active' => $provider->is_active]
        ]);
    }

    public function togglePremium(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        
        if ($provider->is_premium) {
            $provider->update([
                'is_premium' => false,
                'subscription_type' => 'free'
            ]);
            $message = 'Prestataire passé en gratuit';
        } else {
            $provider->activatePremiumSubscription(365); // 1 an
            $message = 'Prestataire passé en premium';
        }
        
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'is_premium' => $provider->is_premium,
                'subscription_type' => $provider->subscription_type
            ]
        ]);
    }

    public function hide(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        $provider->update(['is_hidden' => !$provider->is_hidden]);
        
        return response()->json([
            'success' => true,
            'message' => $provider->is_hidden ? 'Prestataire masqué' : 'Prestataire visible',
            'data' => ['is_hidden' => $provider->is_hidden]
        ]);
    }

    public function lock(Request $request, $id)
    {
        $validated = $request->validate([
            'duration' => 'required|integer|min:1|max:365',
            'reason' => 'required|string|max:500'
        ]);
        
        $provider = Provider::findOrFail($id);
        $provider->update([
            'is_locked' => true,
            'locked_until' => now()->addDays($validated['duration']),
            'status_reason' => $validated['reason']
        ]);
        
        return response()->json([
            'success' => true,
            'message' => "Prestataire verrouillé pour {$validated['duration']} jour(s)",
            'data' => [
                'is_locked' => true,
                'locked_until' => $provider->locked_until,
                'reason' => $validated['reason']
            ]
        ]);
    }

    public function unlock(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        $provider->update([
            'is_locked' => false,
            'locked_until' => null,
            'status_reason' => null
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Prestataire déverrouillé',
            'data' => ['is_locked' => false]
        ]);
    }

    public function addNote(Request $request, $id)
    {
        $validated = $request->validate([
            'note' => 'required|string|max:1000'
        ]);
        
        $provider = Provider::findOrFail($id);
        $currentNotes = $provider->admin_notes ? json_decode($provider->admin_notes, true) : [];
        
        $currentNotes[] = [
            'note' => $validated['note'],
            'admin' => auth()->user()->name,
            'date' => now()->toISOString()
        ];
        
        $provider->update(['admin_notes' => json_encode($currentNotes)]);
        
        return response()->json([
            'success' => true,
            'message' => 'Note ajoutée',
            'data' => ['notes' => $currentNotes]
        ]);
    }

    public function update(Request $request, $id)
    {
        $provider = Provider::findOrFail($id);
        
        $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:10',
            'is_verified' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean'
        ]);
        
        $provider->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Prestataire mis à jour',
            'data' => $provider->fresh()
        ]);
    }

    public function destroy($id)
    {
        $provider = Provider::findOrFail($id);
        $provider->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Prestataire supprimé'
        ]);
    }
}