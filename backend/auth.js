import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'santa-za-secret-key-2025'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Admin@2025'

// Générer un token JWT
export const generateToken = (adminId) => {
  return jwt.sign({ adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
}

// Vérifier un token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

// Middleware d'authentification
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ error: 'Token invalide' })
  }

  req.admin = decoded
  next()
}

// Valider les credentials
export const validateCredentials = (username, password) => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}
