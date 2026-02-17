<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route pour obtenir les informations de l'utilisateur authentifié
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes d'authentification
Route::prefix('auth')->group(function () {
    Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])
        ->middleware('auth:sanctum');
    Route::get('/me', [App\Http\Controllers\Api\AuthController::class, 'me'])
        ->middleware('auth:sanctum');
});

// Routes ADMIN (isolées et sécurisées)
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index']);
    Route::get('/stats', [App\Http\Controllers\Admin\DashboardController::class, 'stats']);
    
    // Profil admin
    Route::get('/profile', function(Request $request) {
        return response()->json(['success' => true, 'data' => $request->user()]);
    });
    Route::put('/profile', function(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:6|confirmed'
        ]);
        
        $user = $request->user();
        
        if ($validated['current_password'] && $validated['new_password']) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['success' => false, 'message' => 'Mot de passe actuel incorrect'], 400);
            }
            $validated['password'] = Hash::make($validated['new_password']);
        }
        
        unset($validated['current_password'], $validated['new_password'], $validated['new_password_confirmation']);
        $user->update($validated);
        
        return response()->json(['success' => true, 'message' => 'Profil mis à jour', 'data' => $user]);
    });
    
    // Gestion prestataires
    Route::get('/providers', [App\Http\Controllers\Admin\ProviderController::class, 'index']);
    Route::get('/providers/{id}', [App\Http\Controllers\Admin\ProviderController::class, 'show']);
    Route::patch('/providers/{id}/toggle-status', [App\Http\Controllers\Admin\ProviderController::class, 'toggleStatus']);
    Route::patch('/providers/{id}/toggle-premium', [App\Http\Controllers\Admin\ProviderController::class, 'togglePremium']);
    Route::patch('/providers/{id}/hide', [App\Http\Controllers\Admin\ProviderController::class, 'hide']);
    Route::patch('/providers/{id}/lock', [App\Http\Controllers\Admin\ProviderController::class, 'lock']);
    Route::patch('/providers/{id}/unlock', [App\Http\Controllers\Admin\ProviderController::class, 'unlock']);
    Route::post('/providers/{id}/note', [App\Http\Controllers\Admin\ProviderController::class, 'addNote']);
    Route::put('/providers/{id}', [App\Http\Controllers\Admin\ProviderController::class, 'update']);
    Route::delete('/providers/{id}', [App\Http\Controllers\Admin\ProviderController::class, 'destroy']);
});

    // Routes pour devenir prestataire
Route::prefix('provider')->group(function () {
    Route::post('/register', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'register']);
    
    // Routes protégées pour prestataires
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/subscription-status', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'getSubscriptionStatus']);
        Route::post('/upgrade-premium', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'upgradeToPremiun']);
        Route::post('/update-photo', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'updateProfilePhoto']);
        Route::get('/profile', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'getProfile']);
    });
});

// Routes publiques pour les visiteurs
Route::prefix('public')->group(function () {
    
    // ChatBot
    Route::post('/chat', [App\Http\Controllers\Api\ChatBotController::class, 'chat']);
    
    // App info (logo, slogan)
    Route::get('/app-info', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'app_name' => 'AMNAFI',
                'slogan' => 'Trouvez le bon prestataire près de chez vous',
                'logo' => '/images/logo.png',
                'description' => 'Plateforme de mise en relation entre particuliers et prestataires de services'
            ]
        ]);
    });
    
    // Categories pour inscription prestataire
    Route::get('/categories-for-registration', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'getCategories']);
    
    // Categories
    Route::apiResource('categories', App\Http\Controllers\Api\CategoryController::class)->only(['index', 'show']);
    Route::get('/categories/{category}/providers', [App\Http\Controllers\Api\CategoryController::class, 'providers']);
    Route::get('/categories/{category}/subcategories/{subcategory}/services', [App\Http\Controllers\Api\CategoryController::class, 'subcategoryServices']);
    
    // Services
    Route::apiResource('services', App\Http\Controllers\Api\ServiceController::class)->only(['index', 'show']);
    Route::get('/services/featured', [App\Http\Controllers\Api\ServiceController::class, 'featured']);
    Route::get('/services/popular', [App\Http\Controllers\Api\ServiceController::class, 'popular']);
    
    // Providers
    Route::get('/providers/verified', [App\Http\Controllers\Api\ProviderController::class, 'verified']);
    Route::get('/providers/top-rated', [App\Http\Controllers\Api\ProviderController::class, 'topRated']);
    Route::get('/providers/by-category/{category}', [App\Http\Controllers\Api\ProviderController::class, 'byCategory']);
    Route::get('/search', [App\Http\Controllers\Api\ProviderController::class, 'globalSearch']);
    Route::apiResource('providers', App\Http\Controllers\Api\ProviderController::class)->only(['index', 'show']);
    
    // Reviews
    Route::get('/reviews', [App\Http\Controllers\Api\ReviewController::class, 'index']);
    Route::get('/services/{service}/reviews', [App\Http\Controllers\Api\ReviewController::class, 'serviceReviews']);
    Route::get('/providers/{provider}/reviews', [App\Http\Controllers\Api\ReviewController::class, 'providerReviews']);
});

// Routes protégées (nécessitent une authentification)
Route::middleware('auth:sanctum')->prefix('protected')->group(function () {
    
    // Test route
    Route::get('/test', function () {
        return response()->json([
            'message' => 'Accès autorisé - API sécurisée avec Sanctum',
            'user' => auth()->user()
        ]);
    });
    
    // Routes CRUD complètes pour les utilisateurs authentifiés
    Route::apiResource('categories', App\Http\Controllers\Api\CategoryController::class)->except(['index', 'show']);
    Route::apiResource('services', App\Http\Controllers\Api\ServiceController::class)->except(['index', 'show']);
    Route::apiResource('providers', App\Http\Controllers\Api\ProviderController::class)->except(['index', 'show']);
    Route::apiResource('reviews', App\Http\Controllers\Api\ReviewController::class)->only(['store', 'update', 'destroy']);
});

// Route de test pour la connexion frontend
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Connexion API réussie',
        'timestamp' => now()->toISOString()
    ]);
});

// Route de santé pour vérifier que l'API fonctionne
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API AMNAFI is running',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});

// Route de debug pour vérifier les données
Route::get('/debug/providers', function () {
    $providers = \App\Models\Provider::with(['user', 'category'])->get();
    $categories = \App\Models\Category::all();
    
    return response()->json([
        'success' => true,
        'data' => [
            'providers_count' => $providers->count(),
            'categories_count' => $categories->count(),
            'providers' => $providers->map(function($p) {
                return [
                    'id' => $p->id,
                    'business_name' => $p->business_name,
                    'category_id' => $p->category_id,
                    'category_name' => $p->category ? $p->category->name : 'Aucune',
                    'is_active' => $p->is_active,
                    'is_premium' => $p->is_premium,
                    'is_hidden' => $p->is_hidden ?? false,
                    'is_locked' => $p->is_locked ?? false,
                    'user_name' => $p->user ? $p->user->name : 'Aucun',
                    'phone' => $p->phone,
                    'created_at' => $p->created_at
                ];
            }),
            'categories' => $categories->map(function($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'providers_count' => \App\Models\Provider::where('category_id', $c->id)->where('is_active', true)->count()
                ];
            })
        ]
    ]);
});

// Routes de paiement PayDunya
Route::prefix('payment')->group(function () {
    Route::post('/create', [App\Http\Controllers\PaymentController::class, 'createPayment']);
    Route::get('/status/{token}', [App\Http\Controllers\PaymentController::class, 'checkStatus']);
    Route::post('/callback', [App\Http\Controllers\PaymentController::class, 'callback']);
});

// Route de test pour l'inscription
Route::post('/test-register', function(\Illuminate\Http\Request $request) {
    \Log::info('Test register data', [
        'all' => $request->all(),
        'files' => $request->allFiles(),
        'has_photo' => $request->hasFile('profile_photo')
    ]);
    return response()->json([
        'received' => $request->all(),
        'files' => array_keys($request->allFiles())
    ]);
});

// Routes de paiement Premium
Route::prefix('premium')->group(function () {
    Route::get('/pricing', [App\Http\Controllers\PremiumPaymentController::class, 'getPremiumPricing']);
    Route::post('/initiate', [App\Http\Controllers\PremiumPaymentController::class, 'initiatePremiumPayment']);
    Route::get('/verify/{token}', [App\Http\Controllers\PremiumPaymentController::class, 'verifyPremiumPayment']);
    Route::post('/callback', [App\Http\Controllers\PremiumPaymentController::class, 'premiumCallback']);
});

// Routes admin publiques temporaires (pour test)
Route::prefix('debug/admin')->group(function () {
    Route::patch('/providers/{id}/toggle-status', function($id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->update(['is_active' => !$provider->is_active]);
        return response()->json([
            'success' => true,
            'message' => $provider->is_active ? 'Prestataire activé' : 'Prestataire désactivé',
            'data' => $provider
        ]);
    });
    
    Route::patch('/providers/{id}/toggle-premium', function($id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->update(['is_premium' => !$provider->is_premium]);
        return response()->json([
            'success' => true,
            'message' => $provider->is_premium ? 'Prestataire premium' : 'Prestataire gratuit',
            'data' => $provider
        ]);
    });
    
    Route::patch('/providers/{id}/hide', function($id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->update(['is_hidden' => !($provider->is_hidden ?? false)]);
        return response()->json([
            'success' => true,
            'message' => $provider->is_hidden ? 'Prestataire masqué' : 'Prestataire visible',
            'data' => $provider
        ]);
    });
    
    Route::patch('/providers/{id}/lock', function(\Illuminate\Http\Request $request, $id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->update([
            'is_locked' => true,
            'locked_until' => now()->addDays($request->duration ?? 7),
            'status_reason' => $request->reason ?? 'Verrouillé par admin'
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Prestataire verrouillé',
            'data' => $provider
        ]);
    });
    
    Route::patch('/providers/{id}/unlock', function($id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->update([
            'is_locked' => false,
            'locked_until' => null,
            'status_reason' => null
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Prestataire déverrouillé',
            'data' => $provider
        ]);
    });
    
    Route::delete('/providers/{id}', function($id) {
        $provider = \App\Models\Provider::findOrFail($id);
        $provider->delete();
        return response()->json([
            'success' => true,
            'message' => 'Prestataire supprimé'
        ]);
    });
    
    Route::get('/providers/search', function(\Illuminate\Http\Request $request) {
        $search = $request->get('q', '');
        $providers = \App\Models\Provider::with(['user', 'category'])
            ->where(function($query) use ($search) {
                $query->where('business_name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhereHas('user', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                      });
            })
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $providers->map(function($p) {
                return [
                    'id' => $p->id,
                    'business_name' => $p->business_name,
                    'phone' => $p->phone,
                    'user_phone' => $p->user->phone ?? null,
                    'category_name' => $p->category->name ?? 'Aucune',
                    'is_active' => $p->is_active,
                    'is_premium' => $p->is_premium,
                    'is_hidden' => $p->is_hidden ?? false,
                    'is_locked' => $p->is_locked ?? false,
                    'user_name' => $p->user->name ?? 'Aucun',
                    'created_at' => $p->created_at
                ];
            })
        ]);
    });
});
