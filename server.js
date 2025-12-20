import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateToken, verifyToken, authMiddleware, validateCredentials } from './backend/auth.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'backend', 'data.json')

const app = express()
const PORT = process.env.PORT || 3000

console.log('📦 Santaza Server Starting...')
console.log(`🔧 PORT: ${PORT}`)
console.log(`📁 DATA_FILE: ${DATA_FILE}`)
console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV}`)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// ==================== UTILITAIRES ====================
const loadData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Erreur lecture data.json:', err)
    return { games: [], users: [] }
  }
}

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Erreur écriture data.json:', err)
    return false
  }
}

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Username et password requis' })
  }
  if (!validateCredentials(username, password)) {
    return res.status(401).json({ error: 'Identifiants invalides' })
  }
  const token = generateToken('admin-main')
  res.json({ success: true, token, admin: { id: 'admin-main', username: 'admin', role: 'admin' } })
})

app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ valid: false })
  const decoded = verifyToken(token)
  if (!decoded) return res.status(403).json({ valid: false })
  res.json({ valid: true, admin: decoded })
})

// Games endpoints
app.get('/api/games', (req, res) => {
  const data = loadData()
  res.json(data.games)
})

app.get('/api/games/:code', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  if (!game) return res.status(404).json({ error: 'Partie non trouvée' })
  res.json(game)
})

app.post('/api/games', (req, res) => {
  const { name, creator, budget, currency } = req.body
  if (!name || !creator) {
    return res.status(400).json({ error: 'Nom et créateur requis' })
  }
  const data = loadData()
  const code = Math.random().toString(36).substring(2, 10).toUpperCase()
  const newGame = {
    id: `game-${Date.now()}`,
    code,
    name,
    creator,
    budget: budget || 0,
    currency: currency || 'FCFA',
    participants: [],
    draws: {},
    drawPerformedAt: null,
    createdAt: new Date().toISOString()
  }
  data.games.push(newGame)
  saveData(data)
  res.status(201).json(newGame)
})

// Participants endpoints
app.post('/api/games/:code/participants', (req, res) => {
  const { name, email } = req.body
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  if (!game) return res.status(404).json({ error: 'Partie non trouvée' })
  
  const accessCode = (name || 'User').substring(0, 3).toUpperCase() + Date.now().toString().slice(-3)
  const participant = {
    id: `p-${Date.now()}`,
    name: name || 'Anonyme',
    email: email || '',
    accessCode,
    joinedAt: new Date().toISOString(),
    hasWishlist: false,
    wishlistItems: []
  }
  game.participants.push(participant)
  saveData(data)
  res.status(201).json(participant)
})

// Wishlist endpoints
app.put('/api/games/:code/participants/:accessCode/wishlist', (req, res) => {
  const { items } = req.body
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  if (!game) return res.status(404).json({ error: 'Partie non trouvée' })
  
  const participant = game.participants.find(p => p.accessCode === req.params.accessCode)
  if (!participant) return res.status(404).json({ error: 'Participant non trouvé' })
  
  participant.wishlistItems = items || []
  participant.hasWishlist = items && items.length > 0
  saveData(data)
  res.json({ success: true, wishlistItems: participant.wishlistItems })
})

// Draw endpoints
app.post('/api/games/:code/draw', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  if (!game) return res.status(404).json({ error: 'Partie non trouvée' })
  
  const participants = game.participants
  if (participants.length < 2) {
    return res.status(400).json({ error: 'Au moins 2 participants requis' })
  }
  
  const draws = {}
  let shuffled = [...participants].sort(() => Math.random() - 0.5)
  let attempts = 0
  const maxAttempts = 100
  
  while (attempts < maxAttempts) {
    shuffled = [...participants].sort(() => Math.random() - 0.5)
    let valid = true
    
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].accessCode === shuffled[i].accessCode) {
        valid = false
        break
      }
    }
    
    if (valid) {
      for (let i = 0; i < participants.length; i++) {
        draws[participants[i].accessCode] = shuffled[i].accessCode
      }
      break
    }
    attempts++
  }
  
  if (Object.keys(draws).length === 0) {
    return res.status(500).json({ error: 'Erreur lors du tirage' })
  }
  
  game.draws = draws
  game.drawPerformedAt = new Date().toISOString()
  saveData(data)
  res.json({ success: true, draws })
})

app.get('/api/games/:code/draws', (req, res) => {
  const data = loadData()
  const game = data.games.find(g => g.code === req.params.code)
  if (!game) return res.status(404).json({ error: 'Partie non trouvée' })
  res.json(game.draws || {})
})

// Delete game
app.delete('/api/games/:code', (req, res) => {
  const data = loadData()
  const index = data.games.findIndex(g => g.code === req.params.code)
  if (index === -1) return res.status(404).json({ error: 'Partie non trouvée' })
  
  data.games.splice(index, 1)
  saveData(data)
  res.json({ success: true })
})

// ==================== STATIC FILES FOR PRODUCTION ====================
if (process.env.NODE_ENV === 'production') {
  // Serve static files from dist
  app.use(express.static(path.join(__dirname, 'dist')))
  
  // Fallback to index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  // Development: just serve static files
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

// ==================== START SERVER ====================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`)
    process.exit(1)
  }
  throw err
})
