import axios from 'axios'

// En production, utiliser la même origine. En dev, utiliser VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}/api`
    : 'http://localhost:3000/api'
)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ==================== GAMES ====================
export const gamesAPI = {
  // Récupérer toutes les parties
  getAll: async () => {
    try {
      const response = await apiClient.get('/games')
      return response.data
    } catch (error) {
      console.error('Erreur getAll games:', error)
      throw error
    }
  },

  // Récupérer une partie par code
  getByCode: async (code) => {
    try {
      const response = await apiClient.get(`/games/${code}`)
      return response.data
    } catch (error) {
      console.error(`Erreur getByCode ${code}:`, error)
      throw error
    }
  },

  // Créer une nouvelle partie
  create: async (gameData) => {
    try {
      const response = await apiClient.post('/games', gameData)
      return response.data
    } catch (error) {
      console.error('Erreur create game:', error)
      throw error
    }
  },

  // Mettre à jour une partie
  update: async (code, gameData) => {
    try {
      const response = await apiClient.put(`/games/${code}`, gameData)
      return response.data
    } catch (error) {
      console.error(`Erreur update game ${code}:`, error)
      throw error
    }
  },

  // Supprimer une partie
  delete: async (code) => {
    try {
      const response = await apiClient.delete(`/games/${code}`)
      return response.data
    } catch (error) {
      console.error(`Erreur delete game ${code}:`, error)
      throw error
    }
  }
}

// ==================== PARTICIPANTS ====================
export const participantsAPI = {
  // Ajouter un participant à une partie
  add: async (gameCode, participantData) => {
    try {
      const response = await apiClient.post(`/games/${gameCode}/participants`, participantData)
      return response.data
    } catch (error) {
      console.error(`Erreur add participant to ${gameCode}:`, error)
      throw error
    }
  },

  // Récupérer tous les participants d'une partie
  getByGameCode: async (gameCode) => {
    try {
      const response = await apiClient.get(`/games/${gameCode}/participants`)
      return response.data
    } catch (error) {
      console.error(`Erreur getByGameCode ${gameCode}:`, error)
      throw error
    }
  }
}

// ==================== WISHLISTS ====================
export const wishlistsAPI = {
  // Mettre à jour la wishlist d'un participant
  update: async (gameCode, accessCode, wishlistItems) => {
    try {
      const response = await apiClient.put(
        `/games/${gameCode}/participants/${accessCode}/wishlist`,
        { wishlistItems }
      )
      return response.data
    } catch (error) {
      console.error(`Erreur update wishlist ${gameCode}/${accessCode}:`, error)
      throw error
    }
  }
}

// ==================== DRAWS ====================
export const drawsAPI = {
  // Effectuer le tirage Secret Santa
  perform: async (gameCode) => {
    try {
      const response = await apiClient.post(`/games/${gameCode}/draw`)
      return response.data
    } catch (error) {
      console.error(`Erreur perform draw ${gameCode}:`, error)
      throw error
    }
  },

  // Récupérer les résultats du tirage
  getResults: async (gameCode) => {
    try {
      const response = await apiClient.get(`/games/${gameCode}/draws`)
      return response.data
    } catch (error) {
      console.error(`Erreur getResults ${gameCode}:`, error)
      throw error
    }
  }
}

export default apiClient
