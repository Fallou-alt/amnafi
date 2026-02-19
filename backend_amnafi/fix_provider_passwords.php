<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Provider;
use Illuminate\Support\Facades\Hash;

echo "🔧 Correction des mots de passe des prestataires...\n\n";

// Récupérer tous les prestataires
$providers = Provider::with('user')->get();

echo "📊 Nombre de prestataires trouvés: " . $providers->count() . "\n\n";

foreach ($providers as $provider) {
    if ($provider->user) {
        $phone = $provider->user->phone;
        
        // Mettre à jour le mot de passe = numéro de téléphone
        $provider->user->password = Hash::make($phone);
        $provider->user->save();
        
        echo "✅ Prestataire: {$provider->business_name}\n";
        echo "   📞 Téléphone: {$phone}\n";
        echo "   🔑 Mot de passe défini: {$phone}\n";
        echo "   👤 Nom: {$provider->user->name}\n\n";
    }
}

echo "✨ Terminé ! Tous les mots de passe ont été réinitialisés.\n";
echo "💡 Les prestataires peuvent maintenant se connecter avec:\n";
echo "   - Identifiant: leur numéro de téléphone\n";
echo "   - Mot de passe: leur numéro de téléphone\n";
