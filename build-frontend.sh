#!/bin/bash

echo "🚀 Build Frontend Amnafi pour Production"
echo "========================================"

cd front_amnafi

echo "📦 Installation des dépendances..."
npm install

echo "🔨 Build de production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    echo ""
    echo "📁 Fichiers générés dans: .next/"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Uploadez le contenu sur Hostinger"
    echo "2. Configurez le domaine/sous-domaine"
    echo "3. Testez l'application"
else
    echo "❌ Erreur lors du build"
    exit 1
fi
