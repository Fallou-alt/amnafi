#!/bin/bash

PHP=/usr/local/bin/php

echo "🔄 RÉIMPORTATION COMPLÈTE DES DONNÉES"
echo "======================================"
echo ""

cd /Users/abc/Documents/amnafi/backend_amnafi

echo "📊 Étape 1: Vérification des données actuelles MySQL..."
$PHP artisan tinker --execute="
echo 'Avant réimport:' . PHP_EOL;
echo '- Users: ' . \App\Models\User::count() . PHP_EOL;
echo '- Providers: ' . \App\Models\Provider::count() . PHP_EOL;
echo '- Categories: ' . \App\Models\Category::count() . PHP_EOL;
echo '- Services: ' . \App\Models\Service::count() . PHP_EOL;
"

echo ""
echo "🗑️  Étape 2: Nettoyage et réinitialisation..."
$PHP artisan migrate:fresh --force

echo ""
echo "📥 Étape 3: Réimportation COMPLÈTE des données..."
$PHP artisan db:seed --force

echo ""
echo "✅ Étape 4: Vérification finale..."
$PHP artisan tinker --execute="
echo PHP_EOL . '=== DONNÉES FINALES ===' . PHP_EOL;
echo 'Users: ' . \App\Models\User::count() . PHP_EOL;
echo 'Providers: ' . \App\Models\Provider::count() . PHP_EOL;
echo 'Categories: ' . \App\Models\Category::count() . PHP_EOL;
echo 'Subcategories: ' . \App\Models\Subcategory::count() . PHP_EOL;
echo 'Services: ' . \App\Models\Service::count() . PHP_EOL;
echo 'Reviews: ' . \App\Models\Review::count() . PHP_EOL;
echo PHP_EOL;
echo 'PROVIDERS DÉTAILS:' . PHP_EOL;
\$providers = \App\Models\Provider::with('user')->get();
foreach(\$providers as \$p) {
    echo '  ✓ ' . \$p->business_name . ' - ' . \$p->city . ' - User: ' . (\$p->user ? \$p->user->name : 'N/A') . PHP_EOL;
}
"

echo ""
echo "🎉 Réimportation terminée!"
