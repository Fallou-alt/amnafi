# 📝 GUIDE ÉTAPE PAR ÉTAPE - DÉPLOIEMENT HOSTINGER

## ✅ ÉTAPE 1 : CRÉER LA BASE DE DONNÉES SUR HOSTINGER

### 1. Connecte-toi à Hostinger Panel (hPanel)
- Va sur https://hpanel.hostinger.com
- Connecte-toi avec tes identifiants

### 2. Créer la base de données MySQL
1. Dans le menu, clique sur **"Bases de données MySQL"**
2. Clique sur **"Créer une nouvelle base de données"**
3. Remplis :
   - **Nom de la base** : `amnafi_db` (ou ce que tu veux)
   - **Nom d'utilisateur** : `amnafi_user` (ou ce que tu veux)
   - **Mot de passe** : Génère un mot de passe fort
4. Clique sur **"Créer"**

### 3. Note ces informations (IMPORTANT !)
```
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456_amnafi_db  (le nom complet avec préfixe)
DB_USERNAME=u123456_amnafi_user (le nom complet avec préfixe)
DB_PASSWORD=ton_mot_de_passe_généré
```

---

## ✅ ÉTAPE 2 : UPLOADER LE BACKEND LARAVEL

### Option A : Via File Manager (Plus simple)

1. Dans hPanel, clique sur **"Gestionnaire de fichiers"**
2. Va dans le dossier `public_html/`
3. **SUPPRIME** tout ce qui est dedans (index.html par défaut)
4. Clique sur **"Télécharger"** (Upload)
5. Sélectionne TOUS les fichiers de ton dossier `backend_amnafi/` :
   - app/
   - bootstrap/
   - config/
   - database/
   - public/
   - resources/
   - routes/
   - storage/
   - vendor/
   - .env
   - artisan
   - composer.json
   - etc.
6. Attends que tout soit uploadé (peut prendre 10-15 minutes)

### Option B : Via FTP (Plus rapide)

1. Télécharge FileZilla : https://filezilla-project.org/
2. Dans hPanel, va dans **"FTP Accounts"**
3. Note les informations FTP :
   - Host : ftp.amnafi.net
   - Username : ton_username
   - Password : ton_password
   - Port : 21
4. Connecte FileZilla avec ces infos
5. Glisse-dépose tout le contenu de `backend_amnafi/` dans `public_html/`

---

## ✅ ÉTAPE 3 : CONFIGURER LE DOCUMENT ROOT

1. Dans hPanel, clique sur **"Domaines"**
2. Trouve `amnafi.net` et clique sur les 3 points → **"Modifier"**
3. Change **"Document Root"** de :
   ```
   /public_html
   ```
   vers :
   ```
   /public_html/public
   ```
4. Clique sur **"Enregistrer"**

---

## ✅ ÉTAPE 4 : CONFIGURER LE FICHIER .ENV

1. Dans le Gestionnaire de fichiers, va dans `public_html/`
2. Trouve le fichier `.env`
3. Clique droit → **"Modifier"**
4. Remplace les lignes de base de données par tes vraies infos :
   ```env
   DB_DATABASE=u123456_amnafi_db
   DB_USERNAME=u123456_amnafi_user
   DB_PASSWORD=ton_mot_de_passe
   ```
5. Change aussi :
   ```env
   PAYDUNYA_MODE=live
   ```
6. Enregistre le fichier

---

## ✅ ÉTAPE 5 : CONFIGURER LES PERMISSIONS

### Via File Manager :
1. Clique droit sur le dossier `storage/` → **"Permissions"**
2. Mets `755` et coche **"Récursif"**
3. Clique sur **"Modifier"**
4. Fais pareil pour `bootstrap/cache/`

---

## ✅ ÉTAPE 6 : EXÉCUTER LES MIGRATIONS (SSH)

### Si tu as accès SSH :
1. Dans hPanel, active **"SSH Access"**
2. Ouvre ton terminal (Mac) :
   ```bash
   ssh u123456@amnafi.net
   # Entre ton mot de passe
   
   cd public_html
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   ```

### Si tu n'as PAS SSH :
Tu devras importer la base de données manuellement :
1. En local, exporte ta BDD :
   ```bash
   php artisan migrate --force
   mysqldump -u root -p amnafi_db > amnafi_db.sql
   ```
2. Dans hPanel → **phpMyAdmin**
3. Sélectionne ta base de données
4. Clique sur **"Importer"**
5. Choisis `amnafi_db.sql`

---

## ✅ ÉTAPE 7 : ACTIVER SSL

1. Dans hPanel, clique sur **"SSL"**
2. Trouve `amnafi.net`
3. Clique sur **"Installer SSL"** (gratuit Let's Encrypt)
4. Attends 2-3 minutes

---

## ✅ ÉTAPE 8 : TESTER L'API

Ouvre ton navigateur et teste :
```
https://amnafi.net/api/public/categories
```

Tu devrais voir du JSON avec les catégories !

---

## 🐛 EN CAS DE PROBLÈME

### Erreur 500
1. Va dans `storage/logs/laravel.log` pour voir l'erreur
2. Vérifie les permissions (755 pour storage/)
3. Vérifie le .env (surtout DB_*)

### Page blanche
1. Vérifie que Document Root = `/public_html/public`
2. Vérifie que `.htaccess` existe dans `public/`

### Erreur de connexion BDD
1. Vérifie DB_HOST=localhost (pas 127.0.0.1)
2. Vérifie le nom complet avec préfixe (u123456_...)

---

## ✅ CHECKLIST

- [ ] Base de données créée
- [ ] Fichiers uploadés dans public_html/
- [ ] Document Root configuré vers /public_html/public
- [ ] .env configuré avec vraies credentials
- [ ] Permissions 755 sur storage/ et bootstrap/cache/
- [ ] Migrations exécutées
- [ ] SSL activé
- [ ] API testée et fonctionne

---

**Une fois que tout fonctionne, passe à l'ÉTAPE 2 : Déployer le Frontend sur Vercel !**
