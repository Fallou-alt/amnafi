# Amnafi Frontend - Next.js

## Installation

```bash
npm install
```

## Démarrage en développement

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Configuration

- L'API Laravel doit être démarrée sur http://localhost:8000
- Les variables d'environnement sont dans `.env.local`

## Structure du projet

```
front_amnafi/
├── app/                 # Pages Next.js (App Router)
├── components/          # Composants réutilisables
├── lib/                # Utilitaires et configuration API
├── types/              # Types TypeScript
└── public/             # Fichiers statiques
```

## Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **Axios** - Client HTTP

## API

La communication avec l'API Laravel se fait via Axios avec :
- Configuration automatique des headers
- Gestion des tokens d'authentification
- Intercepteurs pour les erreurs

## Commandes utiles

```bash
npm run build    # Build de production
npm run start    # Démarrage en production
npm run lint     # Vérification du code
```