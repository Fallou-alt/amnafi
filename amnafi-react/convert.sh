#!/bin/bash

# Script de conversion Next.js → React Vite
# Ce script copie et adapte automatiquement les fichiers

echo "🔄 Conversion Next.js → React Vite en cours..."

# Copier les images
echo "📸 Copie des images..."
cp -r ../front_amnafi/public/images public/ 2>/dev/null || echo "Images déjà copiées"

# Copier les composants
echo "🧩 Copie des composants..."
cp -r ../front_amnafi/components/* src/components/ 2>/dev/null || echo "Composants déjà copiés"

# Copier les types
echo "📝 Copie des types..."
cp -r ../front_amnafi/types/* src/types/ 2>/dev/null || mkdir -p src/types

# Copier lib
echo "📚 Copie de lib..."
cp -r ../front_amnafi/lib/* src/lib/ 2>/dev/null || echo "Lib déjà copié"

echo "✅ Copie terminée !"
echo ""
echo "⚠️  ATTENTION : Les fichiers copiés utilisent encore la syntaxe Next.js"
echo "Il faut maintenant les adapter manuellement :"
echo "  - Remplacer 'next/link' par 'react-router-dom'"
echo "  - Remplacer 'next/image' par <img>"
echo "  - Remplacer 'next/navigation' par 'react-router-dom'"
