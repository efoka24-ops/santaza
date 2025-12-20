import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthContext } from '../context/AuthContext'
import { gamesAPI } from '../services/api'
import { LogOut, Users, Gift, CheckCircle, BarChart3, Trash2, Eye, Download } from 'lucide-react'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { admin, isAuthenticated, logout } = useContext(AuthContext)
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGames: 0,
    totalParticipants: 0,
    totalWishlists: 0,
    averageParticipants: 0,
    drawnGames: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
      return
    }
    loadGames()
  }, [isAuthenticated])

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
        const drawnGames = allGames.filter(g => g.drawPerformedAt).length

        setStats({
          totalGames: allGames.length,
          totalParticipants,
          totalWishlists,
          averageParticipants: Math.round(totalParticipants / allGames.length),
          drawnGames
        })
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Erreur chargement:', error)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleDeleteGame = async (code) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette partie ?')) {
      try {
        await gamesAPI.delete(code)
        loadGames()
      } catch (error) {
        console.error('Erreur suppression:', error)
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['Code', 'Nom', 'Créateur', 'Participants', 'Wishlists', 'Tiré', 'Budget']
    const rows = games.map(game => [
      game.code,
      game.name,
      game.creator,
      game.participants?.length || 0,
      game.participants?.filter(p => p.wishlistItems?.length > 0).length || 0,
      game.drawPerformedAt ? 'Oui' : 'Non',
      `${game.budget} ${game.currency}`
    ])

    let csv = headers.join(',') + '\n'
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `santaza-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de bord Admin</h1>
            <p className="text-gray-600">Bienvenue, <span className="font-semibold text-orange-600">{admin?.username}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </motion.div>

        {/* Statistics */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          {[
            { icon: Gift, label: 'Parties', value: stats.totalGames, color: 'orange' },
            { icon: Users, label: 'Participants', value: stats.totalParticipants, color: 'blue' },
            { icon: CheckCircle, label: 'Wishlists', value: stats.totalWishlists, color: 'green' },
            { icon: Users, label: 'Moy/Partie', value: stats.averageParticipants, color: 'purple' },
            { icon: CheckCircle, label: 'Tirages', value: stats.drawnGames, color: 'red' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            const colorClass = {
              orange: 'from-orange-600 to-orange-700',
              blue: 'from-blue-600 to-blue-700',
              green: 'from-green-600 to-green-700',
              purple: 'from-purple-600 to-purple-700',
              red: 'from-red-600 to-red-700'
            }[stat.color]

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${colorClass} text-white rounded-2xl p-6 shadow-lg`}
              >
                <Icon className="w-8 h-8 mb-4 opacity-80" />
                <p className="text-gray-100 text-sm mb-1">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Parties List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Toutes les parties</h2>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              <Download className="w-5 h-5" />
              Exporter CSV
            </button>
          </div>

          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucune partie pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-orange-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Créateur</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Participants</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Wishlists</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Tirage</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, idx) => {
                    const wishlistCount = game.participants?.filter(p => p.wishlistItems?.length > 0).length || 0
                    return (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-200 hover:bg-orange-50 transition"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-orange-600">{game.code}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{game.name}</td>
                        <td className="py-3 px-4 text-gray-600">{game.creator}</td>
                        <td className="py-3 px-4 text-center font-semibold">{game.participants?.length || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            {wishlistCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-900">
                          {game.budget} {game.currency}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {game.drawPerformedAt ? (
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">✓ Fait</span>
                          ) : (
                            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">En attente</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/game/${game.code}`)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="Voir"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game.code)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
