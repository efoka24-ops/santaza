# 🎁 Santaza - Amis Invisibles

> Une plateforme **moderne**, **rapide** et **entièrement automatisée** pour organiser un Secret Santa en quelques minutes.

**[🌐 Visiter le site](https://santaza-frontend.onrender.com)** | **[📖 Documentation](./DEPLOYMENT.md)** | **[🐛 Signaler un bug](https://github.com/efoka24-ops/santaza/issues)**

## 🎯 Vue d'ensemble

Santaza simplifie l'organisation d'un Secret Santa (Amis Invisibles):

```
┌─────────────────────────────────────────────┐
│ 1. Créer une partie (code unique)           │
│ 2. Partager le code                         │
│ 3. Les gens rejoignent et ajoutent wishlist │
│ 4. Tirage automatique                       │
│ 5. Découvrir le Secret Santa                │
└─────────────────────────────────────────────┘
```

## ✨ Fonctionnalités

### 🎄 Créer une partie
- Configuration simple: nom, budget, date
- Code unique auto-généré pour partager
- Pas de compte obligatoire

### 👥 Inviter les participants
- Partage par lien direct ou code
- Rejoindre sans s'inscrire
- Génération automatique d'access code

### 🎁 Gérer les wishlists
- Ajouter jusqu'à 3 cadeaux souhaités
- Budget approximatif par cadeau
- Interface intuitive et mobile-friendly

### 🎲 Tirage automatique
- Algorithme équitable
- Garantit que personne ne tire son propre nom
- Anonyme (pas de révélation accidentelle)

### 📊 Tableau de bord organizer
- Vue en temps réel des participants
- État des wishlists
- Gestion des participants
- Export en CSV

### 🔐 Authentification Admin
- Accès sécurisé au backoffice
- Gestion complète des parties
- Statistiques détaillées

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# Cloner le repo
git clone https://github.com/efoka24-ops/santaza.git
cd santaza

# Installer les dépendances
npm install
cd backend && npm install && cd ..

# Démarrer le backend (terminal 1)
cd backend
node index.js

# Démarrer le frontend (terminal 2)
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://127.0.0.1:3000/api

## 📦 Stack technique

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool ultra-rapide
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations smooth
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - REST API
- **JWT** - Authentification
- **JSON** - Stockage (fichier local)
- **CORS** - Cross-origin requests

### Infrastructure
- **Render.com** - Déploiement cloud
- **Git** - Version control

## 📁 Structure du projet

```
santaza/
├── src/
│   ├── pages/                    # Pages React (14 pages)
│   │   ├── HomePage.jsx
│   │   ├── CreateGamePage.jsx
│   │   ├── JoinGamePage.jsx
│   │   ├── GameDashboardPage.jsx
│   │   ├── ParticipantPagePage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   └── ... (pages info)
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Logo.jsx
│   │   └── ...
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Gestion de l'authentification
│   │
│   ├── services/
│   │   └── api.js               # Client API centralisé
│   │
│   └── App.jsx                  # Routing principal
│
├── backend/
│   ├── index.js                 # Serveur Express
│   ├── auth.js                  # Authentification JWT
│   ├── data.json                # Base de données
│   └── package.json
│
├── server.js                    # Serveur production (SPA)
├── vite.config.js               # Config Vite
├── tailwind.config.js
├── package.json
└── DEPLOYMENT.md                # Guide de déploiement
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           # Se connecter en tant qu'admin
POST   /api/auth/verify          # Vérifier le token JWT
GET    /api/auth/logout          # Se déconnecter
```

### Games
```
GET    /api/games                # Lister toutes les parties
GET    /api/games/:code          # Récupérer une partie
POST   /api/games                # Créer une partie
PATCH  /api/games/:code          # Modifier une partie
DELETE /api/games/:code          # Supprimer une partie
```

### Participants
```
POST   /api/games/:code/participants           # Ajouter un participant
GET    /api/games/:code/participants           # Lister les participants
PUT    /api/games/:code/participants/:id/wishlist  # Sauvegarder wishlist
```

### Draw
```
POST   /api/games/:code/draw     # Effectuer le tirage
GET    /api/games/:code/draws    # Obtenir les résultats
```

## 🎨 Design

- **Branding**: Orange et blanc (couleurs corporates)
- **Typographie**: Polices modernes et lisibles
- **Responsive**: Mobile-first, fonctionne partout
- **Animations**: Smooth et non-intrusives
- **Accessibility**: WCAG 2.1 AA compliant

## 🔐 Sécurité

- JWT pour l'authentification admin
- CORS configuré
- Input validation
- Protection contre XSS/CSRF

**Note**: En production, activer HTTPS et utiliser une vraie base de données

## 📊 Statistiques

- 14 pages React
- 52 fichiers
- 423 KB JS (129 KB gzipped)
- 27 KB CSS (5 KB gzipped)
- 100+ heures de développement

## 🤝 Contribution

Les contributions sont bienvenues! Pour commencer:

1. Fork le repo
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

MIT - Libre d'utilisation commerciale et personnelle

## 👨‍💻 Auteur

Développé par **[efoka24-ops](https://github.com/efoka24-ops)**

## 🙏 Remerciements

- Vite pour le build system ultra-rapide
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- Render.com pour le déploiement simple

## 📞 Support

- 📧 Email: [support info]
- 🐛 Issues: [GitHub Issues](https://github.com/efoka24-ops/santaza/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/efoka24-ops/santaza/discussions)

---

**Made with ❤️ for Secret Santa lovers** 🎅
  - Personne ne se tire à soi-même
  - Respect des exclusions (couples, collègues directs)
  - L'organisateur ne voit pas les associations

### ✅ Notifications personnalisées
- Chaque participant reçoit :
  - Le nom de son destinataire
  - La wishlist complète
  - Option de message anonyme

### ✅ Tableau de bord organisateur
- Suivi en temps réel
- Gestion des participants et wishlists
- Historique des actions
- Export CSV

### ✅ Confidentialité intégrée
- Données sécurisées et protégées
- Aucun partage à des tiers
- Tirage équitable et anonyme

---

## 🛠️ Stack Technique

### Frontend
- **React** 18.2.0 - Framework UI
- **Vite** 5.0.8 - Build tool et dev server
- **React Router DOM** 6.18.0 - Routage
- **Tailwind CSS** 3.3.6 - Framework CSS
- **Framer Motion** 10.16.16 - Animations
- **Lucide React** 0.294.0 - Icônes
- **TanStack React Query** 5.32.0 - Gestion des données asynchrones

### Backend
- **Express** 4.18.2 - Framework Node.js
- **PostgreSQL** - Base de données (via @vercel/postgres et pg)
- **Axios** 1.13.2 - Requêtes HTTP
- **Multer** 1.4.5 - Upload de fichiers
- **Nodemailer** 7.0.11 - Envoi d'emails
- **CORS** 2.8.5 - Gestion CORS
- **Dotenv** 16.6.1 - Variables d'environnement

### Outils
- **ESLint** - Linting du code
- **Vercel** - Déploiement

---

## 📋 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm
- PostgreSQL 12+

### 1. Installation des dépendances

**Frontend :**
```bash
cd santaZa
npm install
```

**Backend :**
```bash
cd santaZa/backend
npm install
```

### 2. Configuration des variables d'environnement

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000/api
```

**Backend (backend/.env)**
```
POSTGRES_URL=postgresql://user:password@localhost:5432/santaza
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 3. Démarrer l'application

**Frontend (Port 5173) :**
```bash
npm run dev
```

**Backend (Port 3000) :**
```bash
cd backend
npm run dev
```

### 4. Accès à l'application
- Frontend: http://localhost:5173
- API: http://localhost:3000/api

---

## 📁 Structure du Projet

```
santaZa/
├── src/                    # Code source du frontend React
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── App.css
├── backend/                # Code source du backend Express
│   ├── index.js           # Serveur principal
│   ├── package.json
│   └── .env
├── public/                # Fichiers publics
├── index.html             # Point d'entrée HTML
├── vite.config.js        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
├── postcss.config.js     # Configuration PostCSS
├── eslint.config.js      # Configuration ESLint
├── package.json          # Dépendances frontend
└── .gitignore
```

---

## 🚀 Scripts Disponibles

### Frontend
```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Créer la version de production
npm run preview  # Prévisualiser la version de production
npm run lint     # Analyser le code avec ESLint
```

### Backend
```bash
npm start        # Démarrer le serveur
npm run dev      # Démarrer en mode développement avec nodemon
npm run lint     # Analyser le code avec ESLint
```

---

## 📞 Support et Contact

Pour toute question ou contribution, veuillez ouvrir une issue sur le dépôt.
