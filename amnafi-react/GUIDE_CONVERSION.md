# 🔄 GUIDE COMPLET : CONVERSION NEXT.JS → REACT VITE

## ✅ PROJET CRÉÉ : amnafi-react

Structure actuelle :
```
amnafi-react/
├── public/
│   ├── images/          ← Images copiées ✅
│   └── .htaccess        ← Routing SPA + API ✅
├── src/
│   ├── components/      ← Composants copiés ✅
│   ├── lib/
│   │   └── api.ts       ← Config API ✅
│   ├── types/           ← Types copiés ✅
│   ├── App.tsx          ← Router principal ✅
│   └── main.tsx
├── .env                 ← Config production ✅
├── .env.local           ← Config dev ✅
└── vite.config.ts       ← Config Vite ✅
```

---

## 📋 ÉTAPES DE CONVERSION

### ✅ DÉJÀ FAIT :
- [x] Projet Vite créé
- [x] Dépendances installées (React Router, Axios, Framer Motion, Lucide)
- [x] Images copiées
- [x] Composants copiés
- [x] Types copiés
- [x] .htaccess créé
- [x] Configuration API créée

### 🔄 À FAIRE :

#### 1. Convertir les pages Next.js en composants React

**Fichiers à convertir** (dans `front_amnafi/app/`) :
```
✅ Priorité 1 (Pages principales) :
- page.tsx (Accueil)
- prestataires/page.tsx
- services/page.tsx
- provider/login/page.tsx
- provider/register/page.tsx
- provider/dashboard/page.tsx
- provider/profile/page.tsx

⚠️ Priorité 2 (Pages secondaires) :
- categories/page.tsx
- prestataire/page.tsx
- politique-confidentialite/page.tsx
- payment/success/page.tsx
- payment/cancel/page.tsx

🔧 Priorité 3 (Pages admin) :
- admin/prestataires/page.tsx
- admin/prestataires/[id]/page.tsx
```

#### 2. Adaptations nécessaires pour chaque fichier

**Remplacements automatiques :**
```typescript
// AVANT (Next.js)
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// APRÈS (React)
import { Link } from 'react-router-dom'
// <img> normal
import { useNavigate } from 'react-router-dom'
```

**Exemples de conversion :**

```typescript
// AVANT
<Link href="/services">Services</Link>

// APRÈS
<Link to="/services">Services</Link>
```

```typescript
// AVANT
<Image src="/images/logo.png" width={40} height={40} alt="Logo" />

// APRÈS
<img src="/images/logo.png" width="40" height="40" alt="Logo" />
```

```typescript
// AVANT
const router = useRouter()
router.push('/dashboard')

// APRÈS
const navigate = useNavigate()
navigate('/dashboard')
```

---

## 🚀 MÉTHODE RAPIDE : CONVERSION SEMI-AUTOMATIQUE

### Option A : Je convertis pour toi (RECOMMANDÉ)

Je vais créer les pages principales converties. Tu me dis juste :
**"Convertis la page d'accueil"** et je la fais.

### Option B : Tu convertis manuellement

1. Copie un fichier de `front_amnafi/app/` vers `amnafi-react/src/pages/`
2. Remplace les imports Next.js par React Router
3. Remplace `<Link href>` par `<Link to>`
4. Remplace `<Image>` par `<img>`
5. Remplace `useRouter` par `useNavigate`
6. Teste la page

---

## 🎯 PLAN D'ACTION PROPOSÉ

### Phase 1 : Pages essentielles (2-3h)
1. Page d'accueil
2. Liste prestataires
3. Login provider
4. Register provider

### Phase 2 : Dashboard et profil (1-2h)
5. Dashboard provider
6. Profil provider

### Phase 3 : Pages secondaires (1h)
7. Services
8. Catégories
9. Politique de confidentialité

### Phase 4 : Build et déploiement (30min)
10. Build : `npm run build`
11. Upload `dist/` sur Hostinger
12. Tests

---

## 💻 COMMANDES UTILES

### Développement local
```bash
cd amnafi-react
npm run dev
# Ouvre http://localhost:3000
```

### Build pour production
```bash
npm run build
# Génère le dossier dist/
```

### Tester le build localement
```bash
npm run preview
```

---

## 📦 STRUCTURE FINALE SUR HOSTINGER

```
public_html/
├── api/                    ← Laravel
│   ├── app/
│   ├── public/
│   │   ├── index.php
│   │   └── .htaccess
│   └── ...
├── assets/                 ← CSS/JS React (de dist/)
│   ├── index-abc123.js
│   └── index-xyz789.css
├── images/                 ← Images (de dist/)
│   └── ...
├── index.html              ← Page principale (de dist/)
└── .htaccess               ← Routing (déjà créé)
```

---

## ✅ PROCHAINE ÉTAPE

**Veux-tu que je convertisse la première page (Accueil) pour te montrer ?**

Réponds **"OUI"** et je convertis `page.tsx` (Accueil) en React.

Ou dis-moi quelle page tu veux que je convertisse en premier !
