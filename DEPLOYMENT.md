# 🚀 Guide de Déploiement - Santaza

## Déploiement sur Render

### Frontend (React + Vite)

1. **Créer un nouveau Web Service sur Render**
   - Repository: `https://github.com/efoka24-ops/santaza`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

2. **Variables d'environnement**
   ```
   VITE_API_URL=https://santaza-api.onrender.com/api
   NODE_ENV=production
   ```

3. **Ports**
   - Port par défaut: 3000
   - Render assignera automatiquement un port public

### Backend (Express)

1. **Créer un nouveau Web Service pour le backend**
   - Repository: `https://github.com/efoka24-ops/santaza`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node index.js`

2. **Variables d'environnement**
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://santaza-frontend.onrender.com
   JWT_SECRET=your-secret-key-here
   ```

3. **Base de données**
   - Actuellement: Stockage JSON local (`data.json`)
   - Pour la production: Considérer une vraie BDD (MongoDB, PostgreSQL)

## Déploiement local

### Frontend
```bash
cd santaza
npm install
npm run dev    # Développement
npm run build  # Production
npm start      # Servir la prod
```

### Backend
```bash
cd santaza/backend
npm install
node index.js
```

Le serveur écoute sur `http://127.0.0.1:3000`

## Architecture

```
santaza/
├── src/                    # Frontend React
│   ├── pages/             # Pages principales
│   ├── components/        # Composants réutilisables
│   ├── services/          # API client (axios)
│   ├── context/           # Auth context
│   └── App.jsx            # Routing principal
│
├── backend/               # API Express
│   ├── index.js          # Serveur principal
│   ├── auth.js           # Authentification JWT
│   ├── data.json         # Stockage des données
│   └── package.json
│
├── server.js             # Serveur production (SPA)
├── package.json
├── vite.config.js
└── render.yaml           # Config Render
```

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/verify` - Vérifier token
- `GET /api/auth/logout` - Déconnexion

### Parties
- `GET /api/games` - Toutes les parties
- `GET /api/games/:code` - Une partie spécifique
- `POST /api/games` - Créer une partie
- `PATCH /api/games/:code` - Modifier une partie
- `DELETE /api/games/:code` - Supprimer une partie

### Participants
- `POST /api/games/:code/participants` - Ajouter participant
- `GET /api/games/:code/participants` - Lister participants
- `PUT /api/games/:code/participants/:accessCode/wishlist` - Sauvegarder wishlist

### Tirage
- `POST /api/games/:code/draw` - Effectuer le tirage
- `GET /api/games/:code/draws` - Résultats du tirage

## Identifiants Admin (à changer en prod!)

```
Username: admin
Password: Admin@2025
```

⚠️ **À FAIRE**: Changer les identifiants et utiliser une vraie base de données pour la sécurité en production

## Dépannage

### Erreur: "Missing script: start"
→ S'assurer que `server.js` existe et `npm start` est défini dans `package.json`

### CORS errors
→ Vérifier `CORS_ORIGIN` dans les variables d'environnement du backend

### Token JWT invalide
→ S'assurer que `JWT_SECRET` est identique entre frontend et backend

## Prochaines étapes

1. **Base de données**: Migrer vers MongoDB/PostgreSQL
2. **Authentification**: Implémenter un vrai système d'auth (OAuth2, JWT signé)
3. **HTTPS**: Tous les domaines doivent être en HTTPS
4. **Tests**: Ajouter des tests e2e avec Cypress/Playwright
5. **Analytics**: Ajouter Sentry/LogRocket pour la prod
6. **Email**: Implémenter l'envoi d'emails pour les invitations
