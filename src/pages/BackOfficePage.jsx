import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gamesAPI } from '../services/api'
import { Users, Eye, Edit, Trash2, BarChart3, Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BackOfficePage() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState(null)
  const [stats, setStats] = useState({
    totalGames: 0,
    totalParticipants: 0,
    totalWishlists: 0,
    averageParticipants: 0
  })

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const allGames = await gamesAPI.getAll()
      setGames(allGames)

      // Calculer les statistiques
      if (allGames.length > 0) {
        const totalParticipants = allGames.reduce((sum, game) => sum + (game.participants?.length || 0), 0)
        const totalWishlists = allGames.reduce((sum, game) => {
          return sum + (game.participants?.filter(p => p.wishlistItems && p.wishlistItems.length > 0).length || 0)
        }, 0)

        setStats({
          totalGames: allGames.length,
          totalParticipants,
          totalWishlists,
          averageParticipants: allGames.length > 0 ? Math.round(totalParticipants / allGames.length) : 0
        })
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Erreur chargement parties:', error)
      setIsLoading(false)
    }
  }

  const handleDeleteGame = async (code) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette partie ?')) {
      try {
        await gamesAPI.delete(code)
        const updatedGames = games.filter(game => game.code !== code)
        setGames(updatedGames)
        setSelectedGame(null)
      } catch (error) {
        console.error('Erreur suppression partie:', error)
        alert('Erreur: ' + error.message)
      }
    }
  }

  const exportToCSV = (game) => {
    const csv = 'Code,Nom,Email,Wishlist Items\n' + 
      game.participants.map(p => {
        const items = p.wishlistItems?.map(i => i.name).join(' | ') || 'N/A'
        return `${game.code},"${p.name}","${p.email}","${items}"`
      }).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${game.name}-${game.code}.csv`)
    link.click()
  }

  if (isLoading) return <div className="text-center py-20">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Back Office Santaza</h1>
          <p className="text-orange-100">Gérez vos parties Secret Santa</p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Parties créées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGames}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total participants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Wishlists remplies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalWishlists}</p>
              </div>
              <Eye className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Participants/partie</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageParticipants}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Games List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vos Parties</h2>
              <button
                onClick={() => navigate('/create')}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                <Plus size={20} />
                Nouvelle partie
              </button>
            </div>

            <div className="space-y-4">
              {games.length > 0 ? (
                games.map((game, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedGame(game)}
                    className={`bg-white rounded-lg p-6 cursor-pointer transition border-2 ${
                      selectedGame?.code === game.code
                        ? 'border-orange-600 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{game.name}</h3>
                        <p className="text-sm text-gray-600">Code: <span className="font-mono font-bold text-orange-600">{game.code}</span></p>
                      </div>
                      <div className="text-2xl">🎁</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Participants</p>
                        <p className="text-lg font-bold text-gray-900">{game.participants?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-lg font-bold text-gray-900">{game.exchangeDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{game.suggestedBudget} FCFA</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/game/${game.code}`)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition text-sm font-semibold"
                      >
                        <Eye size={16} />
                        Voir
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          exportToCSV(game)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 transition text-sm font-semibold"
                      >
                        <Download size={16} />
                        Exporter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGame(game.code)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition text-sm font-semibold"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600 text-lg mb-4">Aucune partie créée</p>
                  <button
                    onClick={() => navigate('/create')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                  >
                    Créer votre première partie →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Game Details */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              {selectedGame ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedGame.name}</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500">Code de partage</p>
                      <p className="text-lg font-mono font-bold text-orange-600">{selectedGame.code}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Email organisateur</p>
                      <p className="text-sm text-gray-900">{selectedGame.organizerEmail}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Date d'échange</p>
                      <p className="text-sm text-gray-900">{selectedGame.exchangeDate}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Budget conseillé</p>
                      <p className="text-sm text-gray-900">{selectedGame.suggestedBudget} FCFA</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Participants</p>
                      <p className="text-sm text-gray-900">{selectedGame.participants?.length || 0}</p>
                    </div>

                    {selectedGame.description && (
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm text-gray-900">{selectedGame.description}</p>
                      </div>
                    )}
                  </div>

                  {selectedGame.participants?.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-900 mb-3">Participants</h4>
                      <div className="space-y-2">
                        {selectedGame.participants.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {p.name?.[0] || '?'}
                            </div>
                            <div className="text-sm">
                              <p className="font-semibold text-gray-900">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Sélectionnez une partie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
