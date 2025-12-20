import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateToken, verifyToken, authMiddleware, validateCredentials } from './auth.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data.json')

const app = express()
const PORT = process.env.PORT || 3000

console.log('📦 Démarrage du serveur...')
console.log(`🔧 PORT: ${PORT}`)
console.log(`📁 DATA_FILE: ${DATA_FILE}`)

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// ==================== UTILITAIRES ====================
// Charger les données depuis data.json
const loadData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Erreur lecture data.json:', err)
    return { games: [], users: [] }
  }
}

// Sauvegarder les données dans data.json
const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Erreur écriture data.json:', err)
    return false
  }
}

// ==================== ENDPOINTS HEALTH ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// ==================== AUTHENTICATION ENDPOINTS ====================
// POST /api/auth/login - Authentifier un admin
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username et password requis' })
  }

  if (!validateCredentials(username, password)) {
    return res.status(401).json({ error: 'Identifiants invalides' })
  }

  const token = generateToken('admin-main')
  res.json({ 
    success: true, 
    token, 
    admin: { id: 'admin-main', username: 'admin', role: 'admin' }
  })
})

// POST /api/auth/verify - Vérifier un token
app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ valid: false })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ valid: false })
  }

  res.json({ valid: true, admin: decoded })
})

// GET /api/auth/logout - Déconnexion (côté client, supprimer le token)
app.get('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnecté avec succès' })
})

// ==================== GAMES ENDPOINTS ====================
// GET /api/games - Récupérer toutes les parties
app.get('/api/games', (req, res) => {
  const data = loadData()
  res.json(data.games)
})

// GET /api/games/:code - Récupérer une partie par code
app.get('/api/games/:code', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  res.json(game)
})

// POST /api/games - Créer une nouvelle partie
app.post('/api/games', (req, res) => {
  const { name, creator, budget, currency = 'FCFA' } = req.body
  
  if (!name || !creator) {
    return res.status(400).json({ error: 'name et creator requis' })
  }
  
  const data = loadData()
  
  // Générer un code unique
  let code
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase()
  } while (data.games.some(g => g.code === code))
  
  const newGame = {
    id: `game-${Date.now()}`,
    code,
    name,
    creator,
    createdAt: new Date().toISOString(),
    participants: [],
    draws: {},
    drawPerformedAt: null,
    budget,
    currency
  }
  
  data.games.push(newGame)
  saveData(data)
  
  res.status(201).json(newGame)
})

// PUT /api/games/:code - Mettre à jour une partie
app.put('/api/games/:code', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  // Mettre à jour les champs
  Object.assign(game, req.body)
  
  saveData(data)
  res.json(game)
})

// DELETE /api/games/:code - Supprimer une partie
app.delete('/api/games/:code', (req, res) => {
  const data = loadData()
  const index = data.games.findIndex(g => g.code === req.params.code)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  const deletedGame = data.games.splice(index, 1)
  saveData(data)
  
  res.json({ message: 'Partie supprimée', game: deletedGame[0] })
})

// ==================== PARTICIPANTS ENDPOINTS ====================
// POST /api/games/:code/participants - Ajouter un participant
app.post('/api/games/:code/participants', (req, res) => {
  const { name, email } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: 'name et email requis' })
  }
  
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  // Générer un accessCode unique
  let accessCode
  do {
    accessCode = Math.random().toString(36).substring(2, 10).toUpperCase()
  } while (game.participants.some(p => p.accessCode === accessCode))
  
  const newParticipant = {
    id: `p-${Date.now()}`,
    name,
    email,
    accessCode,
    joinedAt: new Date().toISOString(),
    hasWishlist: false,
    wishlistItems: []
  }
  
  game.participants.push(newParticipant)
  saveData(data)
  
  res.status(201).json(newParticipant)
})

// GET /api/games/:code/participants - Récupérer tous les participants
app.get('/api/games/:code/participants', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  res.json(game.participants)
})

// ==================== WISHLIST ENDPOINTS ====================
// PUT /api/games/:code/participants/:accessCode/wishlist - Mettre à jour wishlist
app.put('/api/games/:code/participants/:accessCode/wishlist', (req, res) => {
  const { wishlistItems } = req.body
  
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  const participant = game.participants.find(p => p.accessCode === req.params.accessCode)
  
  if (!participant) {
    return res.status(404).json({ error: 'Participant non trouvé' })
  }
  
  participant.wishlistItems = wishlistItems || []
  participant.hasWishlist = wishlistItems && wishlistItems.length > 0
  
  saveData(data)
  
  res.json(participant)
})

// ==================== DRAW ENDPOINTS ====================
// POST /api/games/:code/draw - Effectuer le tirage
app.post('/api/games/:code/draw', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  if (game.participants.length < 2) {
    return res.status(400).json({ error: 'Minimum 2 participants requis' })
  }
  
  // Algorithme de tirage Secret Santa
  const participants = [...game.participants]
  let assignments = {}
  let valid = false
  let attempts = 0
  const maxRetries = 100
  
  while (!valid && attempts < maxRetries) {
    assignments = {}
    const shuffled = [...participants].sort(() => Math.random() - 0.5)
    valid = true
    
    for (let i = 0; i < shuffled.length; i++) {
      const giver = participants.find(p => p.accessCode === shuffled[i].accessCode)
      const receiver = shuffled[(i + 1) % shuffled.length]
      
      if (giver.accessCode === receiver.accessCode) {
        valid = false
        break
      }
      
      assignments[giver.accessCode] = receiver.accessCode
    }
    
    attempts++
  }
  
  if (!valid) {
    return res.status(500).json({ error: 'Impossible de générer un tirage valide' })
  }
  
  game.draws = assignments
  game.drawPerformedAt = new Date().toISOString()
  
  saveData(data)
  
  res.json({ 
    message: 'Tirage effectué',
    draws: assignments,
    timestamp: game.drawPerformedAt
  })
})

// GET /api/games/:code/draws - Récupérer les résultats du tirage
app.get('/api/games/:code/draws', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  
  if (!game) {
    return res.status(404).json({ error: 'Partie non trouvée' })
  }
  
  res.json({
    draws: game.draws,
    drawPerformedAt: game.drawPerformedAt,
    hasBeenDrawn: !!game.drawPerformedAt
  })
})

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

// ==================== START SERVER ====================
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`)
  console.log(`📁 Data file: ${DATA_FILE}`)
  console.log(`📡 API endpoints: /api/games, /api/health`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} est déjà utilisé!`)
    process.exit(1)
  }
  throw err
})

server.on('error', (err) => {
  console.error('❌ Server error:', err)
})
