# 📝 GUIDE ÉTAPE PAR ÉTAPE - DÉPLOIEMENT VERCEL

## ✅ ÉTAPE 2 : DÉPLOYER LE FRONTEND SUR VERCEL

### Prérequis
- Backend Laravel déployé et fonctionnel sur Hostinger
- Compte GitHub (gratuit)
- Compte Vercel (gratuit)

---

## 🔧 PARTIE 1 : PRÉPARER LE PROJET

### 1. Mettre à jour la configuration API

Ouvre le fichier `.env.production` dans `front_amnafi/` :

```env
NEXT_PUBLIC_API_URL=https://amnafi.net/api
```

### 2. Vérifier next.config.js

Le fichier doit contenir :
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['localhost', 'amnafi.net'],
  },
}

module.exports = nextConfig
```

---

## 📦 PARTIE 2 : PUSH SUR GITHUB

### 1. Créer un repo GitHub

1. Va sur https://github.com
2. Clique sur **"New repository"** (bouton vert)
3. Remplis :
   - **Repository name** : `amnafi-frontend`
   - **Description** : "Frontend AMNAFI - Plateforme de services"
   - **Public** ou **Private** (au choix)
4. **NE COCHE PAS** "Initialize with README"
5. Clique sur **"Create repository"**

### 2. Push ton code

Ouvre le terminal dans VS Code (ou Terminal Mac) :

```bash
cd /Users/abc/Documents/amnafi/front_amnafi

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - AMNAFI Frontend"

# Renommer la branche en main
git branch -M main

# Ajouter le remote (REMPLACE TON-USERNAME par ton vrai username GitHub)
git remote add origin https://github.com/TON-USERNAME/amnafi-frontend.git

# Push
git push -u origin main
```

**Note :** Si c'est ta première fois avec Git, configure d'abord :
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

---

## 🚀 PARTIE 3 : DÉPLOYER SUR VERCEL

### 1. Créer un compte Vercel

1. Va sur https://vercel.com
2. Clique sur **"Sign Up"**
3. Choisis **"Continue with GitHub"**
4. Autorise Vercel à accéder à GitHub

### 2. Importer le projet

1. Sur le dashboard Vercel, clique sur **"Add New..."** → **"Project"**
2. Tu verras la liste de tes repos GitHub
3. Trouve `amnafi-frontend` et clique sur **"Import"**

### 3. Configurer le projet

Vercel détecte automatiquement Next.js. Vérifie :

- **Framework Preset** : Next.js ✅
- **Root Directory** : `./` (par défaut)
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)

### 4. Ajouter les variables d'environnement

1. Clique sur **"Environment Variables"**
2. Ajoute :
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://amnafi.net/api
   ```
3. Sélectionne **"Production"**, **"Preview"**, et **"Development"**

### 5. Déployer !

1. Clique sur **"Deploy"**
2. Attends 2-3 minutes (Vercel va build ton projet)
3. 🎉 **Déploiement réussi !**

Tu verras un écran avec :
- ✅ Building
- ✅ Deploying
- 🎉 Ready

### 6. Voir ton site

Clique sur **"Visit"** ou va sur l'URL affichée :
```
https://amnafi-frontend.vercel.app
```

---

## 🔧 PARTIE 4 : CONFIGURER CORS DANS LARAVEL

Maintenant que tu as l'URL Vercel, configure CORS :

### 1. Éditer config/cors.php sur Hostinger

Via File Manager, édite `public_html/config/cors.php` :

```php
'allowed_origins' => [
    'http://localhost:3000',
    'https://amnafi-frontend.vercel.app',  // Ajoute ton URL Vercel
],
```

### 2. Clear le cache (via SSH ou créer un script)

Si tu as SSH :
```bash
ssh u123456@amnafi.net
cd public_html
php artisan config:clear
php artisan config:cache
```

---

## 🌐 PARTIE 5 : CONFIGURER UN DOMAINE PERSONNALISÉ (OPTIONNEL)

Si tu veux `app.amnafi.net` au lieu de `amnafi-frontend.vercel.app` :

### 1. Dans Vercel

1. Va dans ton projet → **"Settings"** → **"Domains"**
2. Clique sur **"Add"**
3. Entre : `app.amnafi.net`
4. Vercel te donne un enregistrement CNAME

### 2. Dans Hostinger DNS

1. Va dans hPanel → **"DNS Zone Editor"**
2. Ajoute un enregistrement CNAME :
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```
3. Attends 5-10 minutes pour la propagation DNS

---

## 🔄 WORKFLOW DE MISE À JOUR

Maintenant, pour mettre à jour ton site :

```bash
cd front_amnafi

# Fais tes modifications...

git add .
git commit -m "Description des changements"
git push

# Vercel déploie automatiquement ! 🎉
```

---

## ✅ CHECKLIST

- [ ] Code pushé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Site accessible
- [ ] CORS configuré dans Laravel
- [ ] Tests effectués (connexion, recherche, etc.)

---

## 🐛 DÉPANNAGE

### Erreur de build Vercel
- Vérifie les logs de build dans Vercel
- Assure-toi que `package.json` est correct
- Vérifie que toutes les dépendances sont installées

### Erreur CORS
- Vérifie que l'URL Vercel est dans `config/cors.php`
- Clear le cache Laravel : `php artisan config:clear`

### API ne répond pas
- Vérifie que `NEXT_PUBLIC_API_URL` est correct
- Teste l'API directement : `https://amnafi.net/api/public/categories`

---

## 🎉 FÉLICITATIONS !

Ton application AMNAFI est maintenant en ligne :
- **Frontend** : https://amnafi-frontend.vercel.app
- **Backend** : https://amnafi.net/api

**Partage le lien et teste toutes les fonctionnalités !**
