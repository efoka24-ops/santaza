import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { participantsAPI, gamesAPI } from '../services/api'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function JoinGamePage() {
  const navigate = useNavigate()
  
  const [gameCode, setGameCode] = useState('')
  const [participantData, setParticipantData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState(null) // {type: 'success'|'error', message: ''}

  const handleJoinSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)
    
    try {
      // Vérifier que la partie existe
      await gamesAPI.getByCode(gameCode.toUpperCase())
      
      // Ajouter le participant via l'API
      const newParticipant = await participantsAPI.add(gameCode.toUpperCase(), {
        name: participantData.name,
        email: participantData.email
      })
      
      setFeedback({ type: 'success', message: 'Participation confirmée!' })
      
      // Redirection après succès
      setTimeout(() => {
        navigate(`/participant/${newParticipant.accessCode}`)
      }, 1500)
    } catch (error) {
      console.error('Erreur participation:', error)
      setFeedback({ type: 'error', message: error.response?.data?.error || 'Code invalide ou erreur de connexion' })
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
              Rejoignez une partie
            </h1>
            <p className="text-lg text-gray-600">
              Entrez le code de la partie et rejoignez le Secret Santa
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleJoinSubmit} className="space-y-6">
              {/* Game Code Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Code de la partie *
                </label>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder="ABCD1234"
                  required
                  maxLength="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100 text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Vous trouverez ce code dans le lien d'invitation ou auprès de l'organisateur
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Votre nom *
                </label>
                <input
                  type="text"
                  value={participantData.name}
                  onChange={(e) => setParticipantData({...participantData, name: e.target.value})}
                  placeholder="Votre prénom"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Votre email *
                </label>
                <input
                  type="email"
                  value={participantData.email}
                  onChange={(e) => setParticipantData({...participantData, email: e.target.value})}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Feedback Messages */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    feedback.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span className="font-semibold">{feedback.message}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !gameCode}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Rejoindre la partie 🎉'
                )}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">✓ Pas d'inscription obligatoire</span>
              </p>
              <p className="text-sm text-gray-700">
                Rejoignez simplement avec votre nom et email. Vous recevrez un code personnel pour accéder à votre espace participant.
              </p>
            </div>
            <div className="border-t border-orange-200 pt-4">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold">📝 Besoin d'aide?</span>
              </p>
              <button
                type="button"
                onClick={() => navigate('/wishlist-guide')}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm underline"
              >
                → Consultez le guide d'enregistrement de wishlist
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
