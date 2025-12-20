import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gamesAPI } from '../services/api'
import { Copy, CheckCircle } from 'lucide-react'

export default function CreateGamePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const [gameCode, setGameCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    organizerEmail: '',
    exchangeDate: '',
    suggestedBudget: '',
    description: ''
  })

  // Générer le code automatiquement au chargement
  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setGameCode(code)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Appeler l'API pour créer la partie
      const newGame = await gamesAPI.create({
        name: formData.name,
        creator: formData.organizerEmail,
        budget: parseInt(formData.suggestedBudget) || 0,
        currency: 'FCFA'
      })
      
      // Marquer que l'utilisateur a créé une partie
      localStorage.setItem('userCreatedGames', 'true')
      
      // Naviguer vers le tableau de bord
      navigate(`/game/${newGame.code}`)
    } catch (error) {
      console.error('Erreur création partie:', error)
      alert('Erreur: ' + error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Créez votre partie Secret Santa
            </h1>
            <p className="text-lg text-gray-600">
              Configurez les paramètres et invitez vos amis
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom de la partie *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Noël 2025 — Famille"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Code de partage auto-généré */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Code de partage (auto-généré)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={gameCode}
                    disabled
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center text-2xl tracking-widest font-mono font-bold text-orange-600 cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2 font-semibold"
                  >
                    {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    {copied ? 'Copié!' : 'Copier'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ce code sera partagé avec les participants pour rejoindre la partie
                </p>
              </div>

              {/* Organizer Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Votre email (organisateur) *
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Exchange Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date d'échange *
                </label>
                <input
                  type="date"
                  name="exchangeDate"
                  value={formData.exchangeDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Suggested Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Budget conseillé (FCFA)
                </label>
                <input
                  type="number"
                  name="suggestedBudget"
                  value={formData.suggestedBudget}
                  onChange={handleChange}
                  placeholder="Ex: 30000"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  1 EUR ≈ 655 FCFA
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Détails supplémentaires..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
              >
                {isLoading ? 'Création en cours...' : 'Créer la partie 🎁'}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 À savoir:</span> Un code unique sera généré pour partager votre partie. Vous pourrez inviter les participants par lien, email ou code.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
