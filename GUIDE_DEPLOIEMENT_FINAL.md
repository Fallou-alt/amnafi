# 🚀 GUIDE COMPLET : DÉPLOIEMENT HOSTINGER MUTUALISÉ

## ✅ SOLUTION FINALE CHOISIE

**Frontend Next.js (mode standalone) → Vercel (GRATUIT)**
**Backend Laravel → Hostinger (TON HÉBERGEMENT)**

---

## 🎯 POURQUOI CETTE SOLUTION ?

1. ✅ **Aucune modification de code** - Ton projet fonctionne tel quel
2. ✅ **Gratuit** - Vercel est gratuit pour projets personnels
3. ✅ **Simple** - Déploiement en 10 minutes
4. ✅ **Performant** - CDN mondial, SSL automatique
5. ✅ **Maintenance facile** - Push sur GitHub = déploiement auto

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### **PARTIE 1 : DÉPLOYER LE BACKEND LARAVEL SUR HOSTINGER**

#### 1. Préparer Laravel localement

```bash
cd backend_amnafi
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 2. Uploader sur Hostinger

Via File Manager ou FTP :
- Uploadez TOUT `backend_amnafi/` dans `public_html/`
- Structure finale :
```
public_html/
├── app/
├── bootstrap/
├── config/
├── public/          ← Document Root
│   ├── index.php
│   └── .htaccess
├── storage/
├── vendor/
└── .env
```

#### 3. Configurer dans Hostinger Panel

- **Domaines** → Cliquez sur `amnafi.net`
- **Document Root** → Changez vers : `public_html/public`

#### 4. Configurer .env sur le serveur

Éditez `.env` avec les vraies credentials :
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://amnafi.net

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456_amnafi
DB_USERNAME=u123456_amnafi
DB_PASSWORD=VotreMotDePasse

PAYDUNYA_MODE=live
```

#### 5. Via SSH (ou File Manager)

```bash
cd public_html
php artisan migrate --force
php artisan storage:link
chmod -R 755 storage bootstrap/cache
```

#### 6. Activer SSL

- Hostinger Panel → **SSL** → Activer pour `amnafi.net`

✅ **Backend prêt sur : https://amnafi.net/api**

---

### **PARTIE 2 : DÉPLOYER LE FRONTEND SUR VERCEL**

#### 1. Push ton code sur GitHub

```bash
cd front_amnafi
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/amnafi-front.git
git push -u origin main
```

#### 2. Créer un compte Vercel

- Va sur https://vercel.com
- Connecte-toi avec GitHub

#### 3. Importer le projet

- Clique sur **"Add New Project"**
- Sélectionne ton repo `amnafi-front`
- Vercel détecte automatiquement Next.js

#### 4. Configurer les variables d'environnement

Dans Vercel, ajoute :
```
NEXT_PUBLIC_API_URL=https://amnafi.net/api
```

#### 5. Deploy !

- Clique sur **"Deploy"**
- Attends 2-3 minutes
- ✅ Ton site est en ligne !

#### 6. Configurer le domaine (optionnel)

Si tu veux `app.amnafi.net` au lieu de `amnafi-front.vercel.app` :
- Vercel → **Settings** → **Domains**
- Ajoute `app.amnafi.net`
- Configure le CNAME dans Hostinger DNS

---

## 🎉 RÉSULTAT FINAL

```
Frontend : https://amnafi-front.vercel.app (ou app.amnafi.net)
Backend  : https://amnafi.net/api
```

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

1. **Développement local** :
   ```bash
   # Frontend
   cd front_amnafi
   npm run dev  # http://localhost:3000
   
   # Backend
   cd backend_amnafi
   php artisan serve  # http://localhost:8000
   ```

2. **Déploiement** :
   ```bash
   # Frontend : Push sur GitHub
   git add .
   git commit -m "Update"
   git push
   # → Vercel déploie automatiquement !
   
   # Backend : Upload via FTP sur Hostinger
   ```

---

## ⚙️ FICHIERS À VÉRIFIER

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://amnafi.net/api
```

### Backend (.env)
```env
APP_URL=https://amnafi.net
CORS_ALLOWED_ORIGINS=https://amnafi-front.vercel.app,https://app.amnafi.net
```

### Backend (config/cors.php)
```php
'allowed_origins' => [
    'https://amnafi-front.vercel.app',
    'https://app.amnafi.net',
],
```

---

## 🐛 DÉPANNAGE

### Erreur CORS
Ajoute l'URL Vercel dans `config/cors.php`

### Erreur 500 Laravel
```bash
php artisan config:clear
php artisan cache:clear
chmod -R 755 storage
```

### Images ne s'affichent pas
```bash
php artisan storage:link
```

---

## 💰 COÛTS

- **Vercel** : 0€ (gratuit)
- **Hostinger** : ~5€/mois (ton hébergement actuel)
- **Total** : 5€/mois

---

## ✅ CHECKLIST

- [ ] Backend Laravel uploadé sur Hostinger
- [ ] Document Root configuré vers `public/`
- [ ] Base de données créée et .env configuré
- [ ] Migrations exécutées
- [ ] SSL activé
- [ ] Frontend pushé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré
- [ ] Tests effectués

---

**Prêt à déployer ? Commence par la PARTIE 1 (Backend) !**
