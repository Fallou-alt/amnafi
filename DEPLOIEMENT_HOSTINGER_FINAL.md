# 🚀 GUIDE DÉPLOIEMENT HOSTINGER - AMNAFI

## ⚠️ IMPORTANT : Ton projet utilise des routes dynamiques

Ton projet Next.js a des pages dynamiques `[id]` qui nécessitent Node.js.
**Tu ne peux PAS faire un export statique simple.**

## 📋 DEUX OPTIONS POSSIBLES :

---

### **OPTION 1 : Hébergement avec Node.js (RECOMMANDÉ)**

**Prérequis :** VPS ou Cloud Hosting Hostinger (pas mutualisé)

**Structure :**
```
Front Next.js → https://amnafi.net (Node.js sur port 3000)
API Laravel → https://api.amnafi.net
```

**Étapes :**

1. **Sur Hostinger VPS via SSH :**

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Créer les dossiers
mkdir -p /var/www/amnafi.net
mkdir -p /var/www/api.amnafi.net
```

2. **Upload du Frontend :**

```bash
# Depuis ton Mac, upload vers le serveur
scp -r .next/standalone/* user@ton-serveur:/var/www/amnafi.net/
scp -r .next/static user@ton-serveur:/var/www/amnafi.net/.next/
scp -r public user@ton-serveur:/var/www/amnafi.net/
```

3. **Démarrer Next.js avec PM2 :**

```bash
cd /var/www/amnafi.net
pm2 start server.js --name amnafi-front
pm2 save
pm2 startup
```

4. **Configurer Nginx (reverse proxy) :**

```nginx
server {
    listen 80;
    server_name amnafi.net www.amnafi.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Activer SSL :**

```bash
sudo certbot --nginx -d amnafi.net -d www.amnafi.net
```

---

### **OPTION 2 : Hébergement Mutualisé (LIMITÉ)**

**Si tu as seulement un hébergement mutualisé**, tu dois :

1. **Supprimer les routes dynamiques** ou les rendre statiques
2. **Reconfigurer le projet en mode export**

**Modifications nécessaires :**

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```

**Puis supprimer ou modifier ces pages :**
- `/admin/prestataires/[id]`
- `/categories/[id]`
- `/prestataires-officiels/[id]`
- `/joj/official-providers/[id]`
- `/services/[category]`
- `/services/[category]/[subcategory]`

---

## 🎯 MA RECOMMANDATION

**Choisis OPTION 1** si tu veux garder toutes les fonctionnalités.

**Structure finale :**
```
https://amnafi.net → Frontend Next.js (Node.js + PM2)
https://api.amnafi.net → Backend Laravel
```

---

## 📦 FICHIERS PRÊTS

✅ Frontend build : `.next/standalone/` (139 MB)
✅ Backend Laravel : `backend_amnafi/` (prêt)

---

## ❓ QUELLE EST TON TYPE D'HÉBERGEMENT ?

Réponds-moi :
1. **VPS/Cloud** → Je te donne les commandes complètes
2. **Mutualisé** → Je t'aide à simplifier le projet

