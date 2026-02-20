<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProviderRegistrationController extends Controller
{
    public function register(Request $request)
    {
        \Log::info('Registration request received', [
            'all_data' => $request->all(),
            'has_file' => $request->hasFile('profile_photo'),
            'files' => $request->allFiles()
        ]);

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|min:8|max:20',
            'email' => 'nullable|email|unique:users,email',
            'business_name' => 'required|string|max:255',
            'profession' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'city' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
            'profile_photo' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'subscription_type' => 'required|in:free,simple,premium'
        ]);

        $categoryId = $request->category_id;
        $category = Category::find($categoryId);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 400);
        }

        $profilePhotoPath = $this->handleProfilePhotoUpload($request->file('profile_photo'));

        $phone = preg_replace('/[^0-9]/', '', $request->phone);
        $email = $request->email ?? ($phone . '@amnafi.local');
        $fullName = $request->first_name . ' ' . $request->last_name;
        
        // Vérifier si le numéro a déjà 2 profils
        $existingProvidersCount = Provider::where('phone', $request->phone)->count();
        if ($existingProvidersCount >= 2) {
            return response()->json([
                'success' => false,
                'message' => 'Ce numéro de téléphone a déjà atteint la limite de 2 profils prestataires'
            ], 400);
        }
        
        $existingUser = User::where('phone', $request->phone)->first();
        if ($existingUser) {
            // Si l'utilisateur existe déjà, on l'utilise pour créer un nouveau profil prestataire
            $user = $existingUser;
        } else {
            // Sinon on crée un nouvel utilisateur
            $user = User::create([
                'name' => $fullName,
                'email' => $email,
                'phone' => $request->phone,
                'password' => Hash::make($request->phone),
            ]);
        }

        $provider = Provider::create([
            'business_name' => $request->business_name,
            'slug' => Str::slug($request->business_name . '-' . Str::random(6)),
            'description' => $request->description ?? 'Nouveau prestataire sur AMNAFI',
            'phone' => $request->phone,
            'email' => $email,
            'city' => $request->city,
            'address' => $request->city,
            'postal_code' => '00000',
            'profile_photo' => $profilePhotoPath,
            'user_id' => $user->id,
            'category_id' => $categoryId,
            'is_active' => true,
            'is_verified' => false,
            'rating' => 0.0,
            'reviews_count' => 0,
            'services_count' => 0,
            'subscription_type' => $request->subscription_type,
        ]);

        $token = $user->createToken('provider-token')->plainTextToken;
        
        // Gérer l'abonnement selon le type choisi
        if ($request->subscription_type === 'free') {
            // Abonnement gratuit - 30 jours d'essai
            $provider->update([
                'subscription_started_at' => now(),
                'trial_ends_at' => now()->addDays(30),
                'subscription_expires_at' => now()->addDays(30),
                'auto_renew' => false,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie ! Votre période d\'essai de 30 jours est active.',
                'data' => [
                    'user' => $user,
                    'provider' => $provider->load('user', 'category'),
                    'token' => $token,
                    'requires_payment' => false,
                    'subscription_info' => [
                        'type' => 'free',
                        'trial_days' => 30,
                        'expires_at' => $provider->subscription_expires_at,
                    ]
                ]
            ], 201);
        }
        
        // Pour Simple ou Premium, retourner les infos pour le paiement
        return response()->json([
            'success' => true,
            'message' => 'Profil créé. Veuillez procéder au paiement.',
            'data' => [
                'user' => $user,
                'provider' => $provider->load('user', 'category'),
                'token' => $token,
                'requires_payment' => true,
                'subscription_type' => $request->subscription_type,
                'payment_info' => [
                    'amount' => $request->subscription_type === 'premium' ? 2900 : 1000,
                    'provider_id' => $provider->id,
                ]
            ]
        ], 201);
    }

    private function handleProfilePhotoUpload($file)
    {
        if (!$file) {
            throw new \Exception('Photo de profil requise');
        }

        try {
            $filename = 'profile_' . Str::random(20) . '.jpg';
            $path = 'providers/photos/' . $filename;
            
            // Créer le répertoire s'il n'existe pas
            if (!Storage::disk('public')->exists('providers/photos')) {
                Storage::disk('public')->makeDirectory('providers/photos');
            }
            
            // Vérifier si Intervention Image est disponible
            if (class_exists('Intervention\Image\ImageManager')) {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file)
                    ->cover(400, 400)
                    ->toJpeg(85);
                
                Storage::disk('public')->put($path, $image);
            } else {
                // Fallback: upload direct sans redimensionnement
                $path = $file->store('providers/photos', 'public');
            }
            
            return $path;
        } catch (\Exception $e) {
            \Log::error('Erreur upload photo: ' . $e->getMessage());
            // Fallback: upload direct
            return $file->store('providers/photos', 'public');
        }
    }

    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'cover_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $provider = auth()->user()->provider ?? Provider::where('user_id', auth()->id())->first();
        
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        $updates = [];
        
        if ($request->hasFile('profile_photo')) {
            if ($provider->profile_photo && Storage::disk('public')->exists($provider->profile_photo)) {
                Storage::disk('public')->delete($provider->profile_photo);
            }
            $profilePhotoPath = $this->handleProfilePhotoUpload($request->file('profile_photo'));
            $updates['profile_photo'] = $profilePhotoPath;
        }
        
        if ($request->hasFile('cover_photo')) {
            if ($provider->cover_photo && Storage::disk('public')->exists($provider->cover_photo)) {
                Storage::disk('public')->delete($provider->cover_photo);
            }
            $coverPhotoPath = $this->handleCoverPhotoUpload($request->file('cover_photo'));
            $updates['cover_photo'] = $coverPhotoPath;
        }
        
        if (!empty($updates)) {
            $provider->update($updates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Photos mises à jour',
            'data' => [
                'profile_photo_url' => isset($updates['profile_photo']) ? Storage::url($updates['profile_photo']) : null,
                'cover_photo_url' => isset($updates['cover_photo']) ? Storage::url($updates['cover_photo']) : null
            ]
        ]);
    }
    
    private function handleCoverPhotoUpload($file)
    {
        try {
            $filename = 'cover_' . Str::random(20) . '.jpg';
            $path = 'providers/covers/' . $filename;
            
            // Créer le répertoire s'il n'existe pas
            if (!Storage::disk('public')->exists('providers/covers')) {
                Storage::disk('public')->makeDirectory('providers/covers');
            }
            
            // Vérifier si Intervention Image est disponible
            if (class_exists('Intervention\Image\ImageManager')) {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file)
                    ->cover(1200, 400)
                    ->toJpeg(85);
                
                Storage::disk('public')->put($path, $image);
            } else {
                // Fallback: upload direct sans redimensionnement
                $path = $file->store('providers/covers', 'public');
            }
            
            return $path;
        } catch (\Exception $e) {
            \Log::error('Erreur upload cover: ' . $e->getMessage());
            // Fallback: upload direct
            return $file->store('providers/covers', 'public');
        }
    }

    public function getCategories()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'icon', 'color']);

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function upgradeToPremiun(Request $request)
    {
        $provider = auth()->user()->provider ?? Provider::where('user_id', auth()->id())->first();
        
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        $request->validate([
            'duration' => 'nullable|integer|min:1|max:365'
        ]);

        $duration = $request->duration ?? 30;
        $provider->activatePremiumSubscription($duration);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement Premium activé !',
            'data' => [
                'provider' => $provider,
                'subscription_info' => [
                    'type' => $provider->subscription_type,
                    'expires_at' => $provider->subscription_expires_at,
                    'is_premium' => $provider->is_premium,
                    'days_remaining' => $provider->subscription_expires_at ? 
                        now()->diffInDays($provider->subscription_expires_at) : null
                ]
            ]
        ]);
    }

    public function getSubscriptionStatus()
    {
        $provider = auth()->user()->provider ?? Provider::where('user_id', auth()->id())->first();
        
        if (!$provider) {
            return response()->json([
                'success' => false,
                'message' => 'Profil prestataire non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'subscription_type' => $provider->subscription_type,
                'is_premium' => $provider->isPremium(),
                'expires_at' => $provider->subscription_expires_at,
                'is_expired' => $provider->isSubscriptionExpired(),
                'days_remaining' => $provider->subscription_expires_at ? 
                    max(0, now()->diffInDays($provider->subscription_expires_at, false)) : null,
                'badge_visible' => $provider->isPremium()
            ]
        ]);
    }

    public function getProfile()
    {
        $provider = auth()->user()->provider ?? Provider::where('user_id', auth()->id())->first();
        
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
            'data' => $provider
        ]);
    }
}