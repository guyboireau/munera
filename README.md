# 🎵 MUNERA - Collectif Techno Bordeaux

<div align="center">

![MUNERA Logo](public/images/FULL_LOGO_BLANC.png)

**Site web officiel du collectif techno MUNERA**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://munera-iota.vercel.app)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

[🌐 Site en Production](https://munera-iota.vercel.app) • [📧 Contact](mailto:contact@munera.fr) • [📸 Instagram](https://www.instagram.com/collectifmunera/)

</div>

---

## 📖 À Propos

MUNERA est un collectif techno basé à Bordeaux, dédié à la création d'événements immersifs et monumentaux. Ce site web présente nos événements, notre galerie photos et permet la gestion administrative complète.

### ✨ Fonctionnalités

- 🎫 **Gestion d'événements** : Création, modification et affichage des événements
- 📅 **Calendrier** : Vue d'ensemble des événements passés et à venir
- 🗺️ **Carte interactive** : Localisation des événements avec OpenStreetMap
- 📸 **Galerie photos** : Galerie optimisée avec lazy loading
- 🎨 **Générateur de flyers** : Création de visuels pour les événements
- 🔐 **Dashboard admin** : Interface d'administration complète
- ⏰ **Horaires d'événements** : Heures de début et fin personnalisables
- 🌐 **Responsive** : Design adapté mobile, tablette et desktop

---

## 🚀 Technologies

### Frontend
- **React 18** + **TypeScript** - Framework UI moderne et typé
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling utilitaire
- **Framer Motion** - Animations fluides
- **React Router** - Navigation SPA
- **React Hook Form** - Gestion de formulaires

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage (flyers, photos)
  - Row Level Security (RLS)

### Déploiement
- **Vercel** - Hébergement et CI/CD automatique
- **GitHub** - Versioning et collaboration

---

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Compte Vercel (pour le déploiement)

### Configuration Locale

1. **Cloner le repository**
```bash
git clone https://github.com/guyboireau/munera.git
cd munera
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Configurer la base de données**

Exécutez les migrations SQL dans Supabase :
```sql
-- Voir supabase/migrations/ pour toutes les migrations
-- Notamment : 20251127_add_event_times.sql
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

---

## 🗄️ Structure de la Base de Données

### Tables Principales

#### `events`
- Informations des événements (nom, date, lieu, lineup)
- Coordonnées GPS pour la carte
- Heures de début et fin
- Lien Shotgun pour la billetterie

#### `media`
- Photos et vidéos des événements
- Stockage dans Supabase Storage

#### `artists`
- Profils des artistes
- Liens réseaux sociaux

---

## 🎨 Optimisation des Performances

### Images Optimisées

Les images de la galerie sont automatiquement optimisées :
- **Redimensionnement** : Max 1200x1200px
- **Compression** : Quality 80%
- **Réduction** : ~99% de réduction de taille
- **Lazy Loading** : Chargement différé des images

Pour optimiser de nouvelles images :
```bash
npm install --save-dev sharp
node optimize-images.cjs
```

### Recommandations

- ✅ Images optimisées (< 200KB chacune)
- ✅ Lazy loading activé
- ✅ Code splitting avec React Router
- ✅ Build optimisé avec Vite
- ⚠️ Considérer un CDN pour les images en production

---

## 🔐 Administration

### Accès Admin

1. **Via le footer** : Cliquez sur l'icône de cadenas (discrète)
2. **URL directe** : `/admin/login`

### Créer un Compte Admin

Dans Supabase Dashboard :
1. Authentication → Users
2. Add user
3. Entrez email et mot de passe

### Fonctionnalités Admin

- ✏️ Créer/Modifier/Supprimer des événements
- 📸 Gérer la galerie photos
- 🎨 Générer des flyers
- 📊 Voir les statistiques
- 🗑️ Supprimer des flyers

---

## 🚢 Déploiement

### Déploiement Automatique (Vercel)

Le site se déploie automatiquement sur Vercel à chaque push sur `main`.

### Configuration Vercel

1. **Variables d'environnement** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Build Settings** :
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

---

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Optimiser les images
node optimize-images.cjs
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 License

Ce projet est sous licence privée - Tous droits réservés © 2025 MUNERA

---

## 📞 Contact

- **Email** : [contact@munera.fr](mailto:contact@munera.fr)
- **Instagram** : [@collectifmunera](https://www.instagram.com/collectifmunera/)
- **Facebook** : [Collectif MUNERA](https://www.facebook.com/collectifmunera/)

---

<div align="center">

**Fait avec ❤️ par le collectif MUNERA**

[⬆ Retour en haut](#-munera---collectif-techno-bordeaux)

</div>
