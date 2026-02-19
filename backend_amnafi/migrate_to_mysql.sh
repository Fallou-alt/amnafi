#!/bin/bash

echo "🔄 MIGRATION PostgreSQL → MySQL"
echo "================================"
echo ""

PHP=/usr/local/bin/php

# Étape 1: Exporter les données de PostgreSQL
echo "📤 Étape 1/5: Export des données PostgreSQL..."
$PHP artisan db:seed --class=ExportDataSeeder 2>/dev/null || echo "Utilisation de pg_dump..."

# Créer un dump SQL
PGPASSWORD="" pg_dump -h 127.0.0.1 -U postgres -d amnafi_db -F p -f /tmp/amnafi_postgres_dump.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Export PostgreSQL réussi"
else
    echo "⚠️  pg_dump non disponible, utilisation de la méthode Laravel"
fi

# Étape 2: Créer la base MySQL
echo ""
echo "🗄️  Étape 2/5: Création de la base MySQL..."
mysql -u root -e "DROP DATABASE IF EXISTS amnafi_db;" 2>/dev/null
mysql -u root -e "CREATE DATABASE amnafi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
    echo "✅ Base MySQL créée"
else
    echo "❌ Erreur création base MySQL"
    exit 1
fi

# Étape 3: Exécuter les migrations sur MySQL
echo ""
echo "🔨 Étape 3/5: Exécution des migrations MySQL..."
$PHP artisan migrate:fresh --force

if [ $? -eq 0 ]; then
    echo "✅ Migrations MySQL exécutées"
else
    echo "❌ Erreur migrations MySQL"
    exit 1
fi

# Étape 4: Importer les données
echo ""
echo "📥 Étape 4/5: Import des données dans MySQL..."
$PHP artisan db:seed --force

if [ $? -eq 0 ]; then
    echo "✅ Données importées"
else
    echo "❌ Erreur import données"
    exit 1
fi

# Étape 5: Vérification
echo ""
echo "🔍 Étape 5/5: Vérification..."
$PHP artisan tinker --execute="
echo 'Users: ' . \App\Models\User::count() . PHP_EOL;
echo 'Providers: ' . \App\Models\Provider::count() . PHP_EOL;
echo 'Categories: ' . \App\Models\Category::count() . PHP_EOL;
"

echo ""
echo "✨ Migration terminée!"
echo ""
echo "⚠️  IMPORTANT: Vérifiez que toutes les données sont présentes"
echo "   Commande: php artisan tinker"
echo "   Puis: User::count(), Provider::count(), Category::count()"
