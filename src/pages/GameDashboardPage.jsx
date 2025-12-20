import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gamesAPI, drawsAPI } from '../services/api'
import { Users, Calendar, DollarSign, Copy, Download, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

export default function GameDashboardPage() {
  const { gameCode } = useParams()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [game, setGame] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [drawStatus, setDrawStatus] = useState(null) // 'drawing', 'success', 'error'

  // Charger le jeu depuis l'API au montage
  useEffect(() => {
    loadGameData()
  }, [gameCode])

  const loadGameData = async () => {
    try {
      const foundGame = await gamesAPI.getByCode(gameCode)
      setGame(foundGame)
      setIsLoading(false)
    } catch (error) {
      console.error('Erreur chargement jeu:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center py-20">Chargement...</div>
  if (!game) return <div className="text-center py-20">Partie non trouvée</div>

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Algorithme de tirage Secret Santa (aucun ne se tire lui-même)
  const performSecretSantaDraw = async () => {
    if (!game.participants || game.participants.length < 2) {
      setDrawStatus('error')
      setTimeout(() => setDrawStatus(null), 3000)
      return
    }

    setDrawStatus('drawing')

    try {
      // Appeler l'API pour effectuer le tirage
      const result = await drawsAPI.perform(gameCode)
      
      setDrawStatus('success')
      setTimeout(() => {
        setDrawStatus(null)
        loadGameData()
      }, 2000)
    } catch (err) {
      console.error('Erreur tirage:', err)
      setDrawStatus('error')
      setTimeout(() => setDrawStatus(null), 3000)
    }
  }

  const exportToCSV = () => {
    const csv = 'Prénom,Email,Wishlist\n' + 
      game.participants.map(p => `${p.name},${p.email},""`).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${game.name}.csv`)
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl p-8 mb-8 shadow-lg"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{game?.name}</h1>
              <p className="text-orange-100">{game?.description}</p>
              {game?.drawPerformedAt && (
                <div className="flex items-center gap-2 text-orange-100 text-sm mt-2">
                  <CheckCircle size={16} />
                  <span>Tirage effectué le {new Date(game.drawPerformedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">🎄</div>
              {game?.drawPerformedAt && (
                <div className="bg-green-600 bg-opacity-70 rounded-lg px-3 py-2">
                  <p className="text-sm font-bold">✓ TIRÉ</p>
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-orange-500 bg-opacity-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-orange-50 mb-2">Code de partage:</p>
            <div className="flex items-center gap-2">
              <code className="bg-orange-900 px-4 py-2 rounded-lg font-mono text-lg font-semibold flex-1">
                {gameCode}
              </code>
              <button
                onClick={() => copyToClipboard(gameCode)}
                className="bg-white text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition"
              >
                <Copy size={20} />
              </button>
            </div>
            {copied && <p className="text-sm text-orange-50 mt-2">✓ Copié!</p>}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-orange-100 text-sm">Participants</p>
              <p className="text-2xl font-bold">{game?.participants?.length || 0}</p>
            </div>
            <div>
              <p className="text-orange-100 text-sm">Date d'échange</p>
              <p className="text-2xl font-bold">{game?.exchangeDate}</p>
            </div>
            <div>
              <p className="text-orange-100 text-sm">Budget conseillé</p>
              <p className="text-2xl font-bold">{game?.suggestedBudget}€</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['overview', 'participants', 'wishlists'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' ? 'Aperçu' : tab === 'participants' ? 'Participants' : 'Wishlists'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Draw Section */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tirage</h2>
                  <p className="text-gray-600 mb-6">
                    Une fois que tous les participants ont confirmé et rempli leurs wishlists, lancez le tirage automatique.
                  </p>

                  {game?.drawPerformedAt ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center mb-6"
                    >
                      <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 font-bold text-lg">Tirage effectué!</p>
                      <p className="text-sm text-green-600 mt-2">
                        Le {new Date(game.drawPerformedAt).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(game.drawPerformedAt).toLocaleTimeString('fr-FR')}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <button
                        onClick={performSecretSantaDraw}
                        disabled={drawStatus === 'drawing' || game.participants.length < 2}
                        className={`w-full py-4 rounded-lg font-semibold transition text-lg text-white flex items-center justify-center gap-2 ${
                          drawStatus === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : drawStatus === 'error'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400'
                        }`}
                      >
                        {drawStatus === 'drawing' && (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Tirage en cours...
                          </>
                        )}
                        {drawStatus === 'success' && (
                          <>
                            <CheckCircle size={24} />
                            Tirage réussi!
                          </>
                        )}
                        {drawStatus === 'error' && (
                          <>
                            <AlertCircle size={24} />
                            Erreur - Réessayer
                          </>
                        )}
                        {!drawStatus && (
                          <>
                            🎯 Lancer le tirage
                          </>
                        )}
                      </button>
                      {game.participants.length < 2 && (
                        <p className="text-sm text-gray-500 mt-3">
                          ⚠️ Au moins 2 participants sont nécessaires pour faire un tirage
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={exportToCSV}
                      className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 transition font-semibold"
                    >
                      <Download size={20} />
                      Exporter en CSV
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition font-semibold">
                      <Trash2 size={20} />
                      Supprimer la partie
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'participants' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Participants ({game?.participants?.length})</h2>
                <div className="space-y-3">
                  {game?.participants?.map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                          {participant.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{participant.name}</p>
                          <p className="text-sm text-gray-600">{participant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.hasWishlist && (
                          <span className="text-green-600 font-semibold">✓ Wishlist</span>
                        )}
                        {!participant.hasWishlist && (
                          <span className="text-gray-400 text-sm">En attente</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlists' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlists</h2>
                <div className="space-y-6">
                  {game?.participants?.map((participant, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">{participant.name}</h3>
                      {participant.wishlistItems?.length > 0 ? (
                        <ul className="space-y-2">
                          {participant.wishlistItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700">
                              <span className="text-orange-600 font-bold">{i + 1}.</span>
                              <div>
                                <p className="font-semibold">{item.name}</p>
                                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                {item.price && <p className="text-sm text-orange-600">≈ {item.price}€</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Pas encore de wishlist</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Date d'échange</p>
                    <p className="font-semibold text-gray-900">{game?.exchangeDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Budget conseillé</p>
                    <p className="font-semibold text-gray-900">{game?.suggestedBudget}€</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Participants confirmés</p>
                    <p className="font-semibold text-gray-900">{game?.participants?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
