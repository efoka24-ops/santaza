import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gamesAPI } from '../services/api'
import { Gift, RefreshCw, Users, Calendar, Lock, ArrowRight } from 'lucide-react'

export default function PartiesPage() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    loadGames()
    
    // Auto-refresh si activé
    let interval
    if (autoRefresh) {
      interval = setInterval(loadGames, 5000)
    }
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadGames = async () => {
    try {
      setIsLoading(true)
      const allGames = await gamesAPI.getAll()
      setGames(allGames || [])
      setError(null)
    } catch (err) {
      console.error('Erreur chargement parties:', err)
      setError('Impossible de charger les parties')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (game) => {
    if (game.drawPerformedAt) {
      return { label: '✓ Tiré', color: 'bg-green-100 text-green-800' }
    }
    if (game.participants?.length >= 2) {
      return { label: 'Prêt', color: 'bg-blue-100 text-blue-800' }
    }
    return { label: 'Ouvert', color: 'bg-orange-100 text-orange-800' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎁 Parties disponibles
          </h1>
          <p className="text-lg text-gray-600">
            Accédez à vos parties et gérez-les en temps réel
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            <button
              onClick={loadGames}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Auto-refresh (5s)</span>
            </label>
          </div>

          <div className="text-sm text-gray-600">
            {games.length} partie{games.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && games.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des parties...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && games.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune partie</h3>
            <p className="text-gray-600 mb-6">Il n'y a pas encore de parties créées</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Créer une partie
            </button>
          </motion.div>
        )}

        {/* Games Grid */}
        {!isLoading && games.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, idx) => {
              const status = getStatusBadge(game)
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {/* Header Card */}
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{game.name}</h3>
                        <p className="text-orange-100 text-sm">
                          Code: <span className="font-mono font-bold">{game.code}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={18} className="text-orange-600" />
                        <span>{game.participants?.length || 0} participant{(game.participants?.length || 0) !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={18} className="text-orange-600" />
                        <span>
                          {game.createdAt ? new Date(game.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </span>
                      </div>

                      {game.budget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Gift size={18} className="text-orange-600" />
                          <span>Budget: {game.budget} {game.currency}</span>
                        </div>
                      )}

                      {game.drawPerformedAt && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Lock size={18} />
                          <span>Tirage: {new Date(game.drawPerformedAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate(`/game/${game.code}`)}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all group-hover:shadow-lg"
                    >
                      Accéder
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
