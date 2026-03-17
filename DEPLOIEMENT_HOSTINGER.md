# Guide de Déploiement Hostinger - Amnafi

## 📋 Prérequis

- Compte Hostinger avec accès SSH
- Domaine: amnafi.net configuré
- Base de données MySQL créée sur Hostinger

---

## 🚀 PARTIE 1: DÉPLOIEMENT BACKEND LARAVEL

### 1. Préparation locale

```bash
cd backend_amnafi

# Installer les dépendances (sans dev)
composer install --optimize-autoloader --no-dev

# Optimiser Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Configuration Base de données Hostinger

Dans le fichier `.env`, mettez à jour:
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_amnafi  # Remplacer par votre nom de BDD
DB_USERNAME=u123456789_amnafi  # Remplacer par votre username
DB_PASSWORD=VotreMotDePasseHostinger  # Remplacer par votre mot de passe
```

### 3. Upload sur Hostinger

**Via File Manager ou FTP:**
- Uploadez TOUT le contenu de `backend_amnafi/` dans `public_html/`
- Le dossier `public/` de Laravel doit être à la racine de `public_html/`

**Structure finale sur Hostinger:**
```
public_html/
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          # Contenu accessible publiquement
│   ├── index.php
│   └── .htaccess
├── resources/
├── routes/
├── storage/
├── vendor/
├── .env
└── artisan
```

### 4. Configuration du Document Root

Dans Hostinger Panel:
1. Allez dans "Avancé" → "Domaines"
2. Cliquez sur votre domaine `amnafi.net`
3. Changez le Document Root vers: `public_html/public`

### 5. Permissions

Via SSH ou File Manager:
```bash
chmod -R 755 storage bootstrap/cache
```

### 6. Migration de la base de données

Via SSH:
```bash
cd public_html
php artisan migrate --force
php artisan db:seed --force  # Si vous avez des seeders
```

### 7. Créer le lien symbolique pour storage

```bash
php artisan storage:link
```

---

## 🎨 PARTIE 2: BUILD ET DÉPLOIEMENT FRONTEND NEXT.JS

### 1. Build local dans VS Code

```bash
cd front_amnafi

# Installer les dépendances
npm install

# Build pour production
npm run build
```

Cela crée un dossier `.next/` avec les fichiers optimisés.

### 2. Options de déploiement Next.js sur Hostinger

#### Option A: Export statique (Recommandé pour Hostinger)

**Modifier `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

**Build et export:**
```bash
npm run build
```

Cela crée un dossier `out/` avec les fichiers statiques.

**Upload:**
- Créez un sous-domaine `app.amnafi.net` dans Hostinger
- Uploadez le contenu de `out/` dans le dossier du sous-domaine

#### Option B: Déploiement Node.js (Si Hostinger supporte Node.js)

**Upload:**
- Uploadez tout le projet `front_amnafi/` via SSH
- Installez les dépendances: `npm install --production`
- Démarrez: `npm run start`

---

## ⚙️ PARTIE 3: CONFIGURATIONS FINALES

### 1. CORS Laravel

Vérifiez `config/cors.php`:
```php
'allowed_origins' => [
    'https://amnafi.net',
    'https://app.amnafi.net',
],
```

### 2. Variables d'environnement

**Backend (.env):**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://amnafi.net

PAYDUNYA_MODE=live  # Passer en mode production
PAYDUNYA_RETURN_URL=https://amnafi.net/payment/success
PAYDUNYA_CANCEL_URL=https://amnafi.net/payment/cancel
PAYDUNYA_CALLBACK_URL=https://amnafi.net/api/premium/callback
```

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://amnafi.net/api
```

### 3. SSL/HTTPS

Hostinger fournit SSL gratuit:
1. Allez dans "Sécurité" → "SSL"
2. Activez le certificat SSL pour `amnafi.net`
3. Forcez HTTPS (déjà configuré dans .htaccess)

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### Backend Laravel:
- [ ] Fichier `.env` configuré avec les bonnes credentials
- [ ] `APP_DEBUG=false` et `APP_ENV=production`
- [ ] Base de données créée sur Hostinger
- [ ] Migrations exécutées
- [ ] Permissions storage et cache configurées
- [ ] `php artisan storage:link` exécuté
- [ ] Caches Laravel générés (config, route, view)
- [ ] SSL activé et HTTPS forcé

### Frontend Next.js:
- [ ] Build réussi sans erreurs
- [ ] `.env.production` avec la bonne URL API
- [ ] Fichiers uploadés sur Hostinger
- [ ] Domaine/sous-domaine configuré

### Tests:
- [ ] API accessible: `https://amnafi.net/api`
- [ ] Frontend accessible: `https://amnafi.net` ou `https://app.amnafi.net`
- [ ] Connexion/Inscription fonctionne
- [ ] Paiements PayDunya en mode production testés

---

## 🐛 DÉPANNAGE

### Erreur 500 Laravel
```bash
# Vérifier les logs
tail -f storage/logs/laravel.log

# Recréer les caches
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

### Erreur de permissions
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Base de données non accessible
- Vérifiez que l'IP du serveur est autorisée dans MySQL Remote
- Utilisez `localhost` au lieu de `127.0.0.1`

---

## 📞 SUPPORT

En cas de problème:
1. Vérifiez les logs Laravel: `storage/logs/laravel.log`
2. Vérifiez les logs Hostinger dans le panel
3. Contactez le support Hostinger pour les problèmes serveur

---

**Dernière mise à jour:** $(date)
