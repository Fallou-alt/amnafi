#!/bin/bash

echo "🚀 Préparation Backend Laravel pour Production"
echo "=============================================="

cd backend_amnafi

echo "📦 Installation des dépendances (production)..."
composer install --optimize-autoloader --no-dev

echo "🔧 Optimisation Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔐 Génération de la clé d'application..."
php artisan key:generate

if [ $? -eq 0 ]; then
    echo "✅ Backend prêt pour le déploiement!"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Uploadez tous les fichiers sur Hostinger (public_html/)"
    echo "2. Configurez le Document Root vers public_html/public"
    echo "3. Mettez à jour le fichier .env avec les credentials Hostinger"
    echo "4. Exécutez: php artisan migrate --force"
    echo "5. Exécutez: php artisan storage:link"
    echo "6. Configurez les permissions: chmod -R 755 storage bootstrap/cache"
else
    echo "❌ Erreur lors de la préparation"
    exit 1
fi
