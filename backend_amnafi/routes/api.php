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
    Route::patch('/providers/{id}/toggle-verified', [App\Http\Controllers\Admin\ProviderController::class, 'toggleVerified']);
    Route::patch('/providers/{id}/hide', [App\Http\Controllers\Admin\ProviderController::class, 'hide']);
    Route::patch('/providers/{id}/lock', [App\Http\Controllers\Admin\ProviderController::class, 'lock']);
    Route::patch('/providers/{id}/unlock', [App\Http\Controllers\Admin\ProviderController::class, 'unlock']);
    Route::post('/providers/{id}/note', [App\Http\Controllers\Admin\ProviderController::class, 'addNote']);
    Route::put('/providers/{id}', [App\Http\Controllers\Admin\ProviderController::class, 'update']);
    Route::delete('/providers/{id}', [App\Http\Controllers\Admin\ProviderController::class, 'destroy']);
    
    // Gestion missions officielles
    Route::get('/missions', [App\Http\Controllers\Admin\MissionController::class, 'index']);
    Route::get('/missions/stats', [App\Http\Controllers\Admin\MissionController::class, 'stats']);
    Route::get('/missions/{id}', [App\Http\Controllers\Admin\MissionController::class, 'show']);
    Route::post('/missions/{id}/approve', [App\Http\Controllers\Admin\MissionController::class, 'approve']);
    Route::post('/missions/{id}/assign', [App\Http\Controllers\Admin\MissionController::class, 'assignProvider']);
    Route::post('/missions/{id}/reject', [App\Http\Controllers\Admin\MissionController::class, 'reject']);
    Route::post('/missions/{id}/complete', [App\Http\Controllers\Admin\MissionController::class, 'complete']);
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
        Route::put('/profile', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'updateProfile']);
        Route::post('/upload-photo', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'updateProfilePhoto']);
        Route::put('/password', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'updatePassword']);
        Route::put('/geolocation', [App\Http\Controllers\Api\ProviderRegistrationController::class, 'updateGeolocation']);
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
    
    // Official Providers
    Route::get('/official-providers', [App\Http\Controllers\Api\OfficialProviderController::class, 'index']);
    Route::get('/official-providers/{id}', [App\Http\Controllers\Api\OfficialProviderController::class, 'show']);
    
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
    
    // Missions et avis pour prestataires officiels
    Route::post('/missions', [App\Http\Controllers\Api\OfficialProviderController::class, 'createMission']);
    Route::post('/service-reviews', [App\Http\Controllers\Api\OfficialProviderController::class, 'addReview']);
});

// Routes Profil Utilisateur
Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
    Route::get('/', [App\Http\Controllers\Api\ProfileController::class, 'show']);
    Route::put('/', [App\Http\Controllers\Api\ProfileController::class, 'update']);
    Route::put('/password', [App\Http\Controllers\Api\ProfileController::class, 'updatePassword']);
    Route::post('/photo', [App\Http\Controllers\Api\ProfileController::class, 'updatePhoto']);
    Route::delete('/photo', [App\Http\Controllers\Api\ProfileController::class, 'deletePhoto']);
    Route::put('/geolocation', [App\Http\Controllers\Api\ProfileController::class, 'updateGeolocation']);
    Route::delete('/', [App\Http\Controllers\Api\ProfileController::class, 'destroy']);
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

// Routes de paiement PayDunya
Route::prefix('payment')->group(function () {
    Route::post('/create', [App\Http\Controllers\PaymentController::class, 'createPayment']);
    Route::get('/status/{token}', [App\Http\Controllers\PaymentController::class, 'checkStatus']);
    Route::post('/callback', [App\Http\Controllers\PaymentController::class, 'callback']);
});

// Route de test pour l'inscription

// ========================================
// Routes JOJ - Prestataires Officiels
// ========================================
Route::prefix('joj')->group(function () {
    // Public (Touristes via QR Code)
    Route::get('official-providers', [App\Http\Controllers\Api\JOJ\OfficialProviderController::class, 'index']);
    Route::get('official-providers/{id}', [App\Http\Controllers\Api\JOJ\OfficialProviderController::class, 'show']);
    
    // Touristes authentifiés
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('missions', [App\Http\Controllers\Api\JOJ\MissionController::class, 'store']);
        Route::get('missions', [App\Http\Controllers\Api\JOJ\MissionController::class, 'index']);
        Route::get('missions/{id}', [App\Http\Controllers\Api\JOJ\MissionController::class, 'show']);
    });

    // Admin uniquement
    Route::prefix('admin')->middleware(['auth:sanctum', App\Http\Middleware\AdminOnly::class])->group(function () {
        Route::get('official-providers', [App\Http\Controllers\Api\JOJ\AdminProviderController::class, 'index']);
        Route::post('official-providers', [App\Http\Controllers\Api\JOJ\AdminProviderController::class, 'store']);
        Route::post('official-providers/{id}', [App\Http\Controllers\Api\JOJ\AdminProviderController::class, 'update']);
        Route::delete('official-providers/{id}', [App\Http\Controllers\Api\JOJ\AdminProviderController::class, 'destroy']);
        Route::post('official-providers/{id}/toggle-status', [App\Http\Controllers\Api\JOJ\AdminProviderController::class, 'toggleStatus']);
        Route::get('missions', [App\Http\Controllers\Api\JOJ\AdminMissionController::class, 'index']);
        Route::post('missions/{id}/validate', [App\Http\Controllers\Api\JOJ\AdminMissionController::class, 'validate']);
        Route::post('missions/{id}/assign', [App\Http\Controllers\Api\JOJ\AdminMissionController::class, 'assign']);
        Route::post('missions/{id}/cancel', [App\Http\Controllers\Api\JOJ\AdminMissionController::class, 'cancel']);
    });
});
