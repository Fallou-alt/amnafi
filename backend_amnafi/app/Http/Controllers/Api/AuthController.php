<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'sometimes|string',
            'email' => 'sometimes|email', 
            'password' => 'required|string'
        ]);

        // Chercher l'utilisateur par email ou téléphone
        $user = null;
        if ($request->has('email') && $request->email) {
            $user = User::where('email', $request->email)->first();
        } elseif ($request->has('phone') && $request->phone) {
            $user = User::where('phone', $request->phone)->first();
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // Si c'est un admin
        if ($user->is_admin) {
            return response()->json([
                'success' => true,
                'message' => 'Connexion admin réussie',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'user_type' => 'admin',
                    'redirect_url' => '/admin/dashboard'
                ]
            ]);
        }

        // Pour les prestataires
        $provider = Provider::where('user_id', $user->id)->first();
        
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé. Veuillez d\'abord créer votre profil prestataire.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Connexion prestataire réussie',
            'data' => [
                'user' => $user,
                'provider' => $provider->load('category'),
                'token' => $token,
                'user_type' => 'provider',
                'redirect_url' => '/provider/dashboard'
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        
        // Si c'est un admin
        if ($user->is_admin) {
            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        }
        
        // Pour les prestataires
        $provider = Provider::where('user_id', $user->id)->first();

        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        $provider->load('category');
        $provider->profile_photo_url = $provider->profile_photo ? url('storage/' . $provider->profile_photo) : null;
        $provider->cover_photo_url = $provider->cover_photo ? url('storage/' . $provider->cover_photo) : null;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'provider' => $provider
            ]
        ]);
    }
}