<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('provider.category');
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'is_admin' => $user->is_admin
                ],
                'provider' => $user->provider ? [
                    'id' => $user->provider->id,
                    'business_name' => $user->provider->business_name,
                    'description' => $user->provider->description,
                    'phone' => $user->provider->phone,
                    'secondary_phone' => $user->provider->secondary_phone,
                    'email' => $user->provider->email,
                    'website' => $user->provider->website,
                    'address' => $user->provider->address,
                    'city' => $user->provider->city,
                    'postal_code' => $user->provider->postal_code,
                    'profile_photo' => $user->provider->profile_photo ? url('storage/' . $user->provider->profile_photo) : null,
                    'cover_photo' => $user->provider->cover_photo ? url('storage/' . $user->provider->cover_photo) : null,
                    'geolocation_enabled' => $user->provider->geolocation_enabled ?? true,
                    'category' => $user->provider->category,
                    'subscription_type' => $user->provider->subscription_type,
                    'subscription_expires_at' => $user->provider->subscription_expires_at,
                    'is_premium' => $user->provider->is_premium,
                    'is_verified' => $user->provider->is_verified,
                    'rating' => $user->provider->rating,
                    'reviews_count' => $user->provider->reviews_count
                ] : null
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'sometimes|string|max:20',
            'business_name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'provider_phone' => 'sometimes|string|max:20',
            'provider_secondary_phone' => 'sometimes|nullable|string|max:20',
            'provider_email' => 'sometimes|email|max:255',
            'website' => 'sometimes|url|max:255',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:10',
            'category_id' => 'sometimes|exists:categories,id'
        ]);

        // Mise à jour User
        $userFields = ['name', 'email', 'phone'];
        $userData = array_intersect_key($validated, array_flip($userFields));
        if (!empty($userData)) {
            $user->update($userData);
        }

        // Mise à jour Provider
        if ($user->provider) {
            $providerFields = [
                'business_name', 'description', 'website', 
                'address', 'city', 'postal_code', 'category_id'
            ];
            
            $providerData = array_intersect_key($validated, array_flip($providerFields));
            
            if (isset($validated['provider_phone'])) {
                $providerData['phone'] = $validated['provider_phone'];
            }
            if (isset($validated['provider_secondary_phone'])) {
                $providerData['secondary_phone'] = $validated['provider_secondary_phone'];
            }
            if (isset($validated['provider_email'])) {
                $providerData['email'] = $validated['provider_email'];
            }
            
            if (!empty($providerData)) {
                $user->provider->update($providerData);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => $user->load('provider.category')
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe actuel incorrect'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }

    public function updatePhoto(Request $request)
    {
        try {
            $request->validate([
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'type' => 'required|in:profile,cover'
            ]);

            $user = $request->user();
            
            if (!$user->provider) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil prestataire non trouvé'
                ], 404);
            }

            $type = $request->type;
            $field = $type === 'profile' ? 'profile_photo' : 'cover_photo';

            // Supprimer ancienne photo
            if ($user->provider->$field) {
                Storage::disk('public')->delete($user->provider->$field);
            }

            // Sauvegarder nouvelle photo
            $path = $request->file('photo')->store('providers/' . $type, 'public');
            
            $user->provider->update([$field => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Photo mise à jour avec succès',
                'data' => [
                    'url' => url('storage/' . $path)
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur upload photo: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deletePhoto(Request $request)
    {
        $request->validate([
            'type' => 'required|in:profile,cover'
        ]);

        $user = $request->user();
        
        if (!$user->provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        $type = $request->type;
        $field = $type === 'profile' ? 'profile_photo' : 'cover_photo';

        if ($user->provider->$field) {
            Storage::disk('public')->delete($user->provider->$field);
            $user->provider->update([$field => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Photo supprimée avec succès'
        ]);
    }

    public function updateGeolocation(Request $request)
    {
        $validated = $request->validate([
            'geolocation_enabled' => 'required|boolean'
        ]);

        $user = $request->user();
        
        if (!$user->provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        $user->provider->update([
            'geolocation_enabled' => $validated['geolocation_enabled']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Paramètre de géolocalisation mis à jour'
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        // Supprimer les photos du provider
        if ($user->provider) {
            if ($user->provider->profile_photo) {
                Storage::disk('public')->delete($user->provider->profile_photo);
            }
            if ($user->provider->cover_photo) {
                Storage::disk('public')->delete($user->provider->cover_photo);
            }
            $user->provider->delete();
        }

        // Supprimer l'utilisateur
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Compte supprimé avec succès'
        ]);
    }
}
