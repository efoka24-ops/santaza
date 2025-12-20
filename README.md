# 🎁 Santaza - Amis Invisibles

Une plateforme simple, moderne et entièrement automatisée pour organiser un Secret Santa en quelques minutes.

## 🌟 Fonctionnalités

### ✅ Créer une partie (2 minutes)
- L'organisateur configure le nom du groupe, la date d'échange et le budget conseillé
- Un code unique est généré pour partager facilement

### ✅ Inviter les participants
- Partage par lien, email ou code
- Aucun compte obligatoire

### ✅ Recueillir les wishlists
- Chaque participant ajoute jusqu'à 3 cadeaux souhaités
- Descriptions, priorités et liens produits disponibles

### ✅ Tirage automatique et anonyme
- Algorithme équitable garantissant :
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
