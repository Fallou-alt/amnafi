# GUIDE DE MIGRATION PostgreSQL → MySQL

## ⚠️ MySQL n'est pas démarré sur votre système

### Étape 1: Démarrer MySQL

**Option A - Via Homebrew:**
```bash
brew services start mysql
```

**Option B - Via MAMP/XAMPP:**
- Ouvrir MAMP ou XAMPP
- Démarrer le serveur MySQL

**Option C - Vérifier si MySQL est installé:**
```bash
brew install mysql
brew services start mysql
```

### Étape 2: Créer la base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base
CREATE DATABASE amnafi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Étape 3: Vérifier la connexion dans .env

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=amnafi_db
DB_USERNAME=root
DB_PASSWORD=
```

### Étape 4: Exécuter les migrations

```bash
cd /Users/abc/Documents/amnafi/backend_amnafi
php artisan migrate:fresh --seed
```

### Étape 5: Vérifier les données

```bash
php artisan tinker
```

Puis dans tinker:
```php
User::count()
Provider::count()
Category::count()
```

## 🔄 Alternative: Garder PostgreSQL

Si vous préférez garder PostgreSQL, modifiez .env:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=amnafi_db
DB_USERNAME=postgres
DB_PASSWORD=
```

## 📊 État actuel

- ✅ Configuration .env pointée vers MySQL
- ❌ MySQL non démarré ou non installé
- ✅ Migrations prêtes
- ✅ Seeders prêts

## 🚀 Prochaines étapes

1. Démarrer MySQL
2. Créer la base amnafi_db
3. Lancer: `php artisan migrate:fresh --seed`
