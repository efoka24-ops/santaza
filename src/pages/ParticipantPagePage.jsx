import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { gamesAPI, wishlistsAPI } from '../services/api'
import { motion } from 'framer-motion'
import { Heart, Gift, Users, Calendar, Lock, Plus, Trash2, Check, AlertCircle, Clock } from 'lucide-react'

export default function ParticipantPagePage() {
  const { accessCode } = useParams()

  const [participant, setParticipant] = useState(null)
  const [game, setGame] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('wishlist')
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: '', price: '' },
    { id: 2, name: '', price: '' },
    { id: 3, name: '', price: '' }
  ])
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    loadParticipantData()
  }, [accessCode])

  const loadParticipantData = async () => {
    try {
      const allGames = await gamesAPI.getAll()
      
      for (const gameData of allGames) {
        if (gameData.participants?.some(p => p.accessCode === accessCode)) {
          const foundParticipant = gameData.participants.find(p => p.accessCode === accessCode)
          setGame(gameData)
          setParticipant(foundParticipant)
          
          if (foundParticipant.wishlistItems?.length > 0) {
            setWishlistItems(foundParticipant.wishlistItems)
          }
          break
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistChange = (id, field, value) => {
    setWishlistItems(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const addWishlistItem = () => {
    const newId = Math.max(...wishlistItems.map(i => i.id), 0) + 1
    setWishlistItems([...wishlistItems, { id: newId, name: '', price: '' }])
  }

  const removeWishlistItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  const handleSaveWishlist = async () => {
    if (!accessCode || !game) return
    
    setSaveStatus('saving')
    try {
      const itemsToSave = wishlistItems.filter(item => item.name.trim())
      await wishlistsAPI.update(game.code, accessCode, itemsToSave)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 2000)
      loadParticipantData()
    } catch (error) {
      console.error('Erreur:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!participant || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Participant non trouvé</h1>
          <p className="text-gray-600">Le code d'accès est invalide ou la partie n'existe pas.</p>
        </div>
      </div>
    )
  }

  const assignment = game.draws?.[accessCode]
  const assignedParticipant = assignment ? game.participants.find(p => p.accessCode === assignment) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-3xl p-8 mb-12 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-4">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-medium">{game.name}</span>
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Bienvenue, <span className="text-orange-200">{participant.name}</span>! 🎁
              </h1>
              <p className="text-orange-100 text-lg">
                Préparez votre wishlist pour le Secret Santa du {new Date(game.createdAt || Date.now()).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="hidden md:block text-6xl opacity-30">🎅</div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-orange-500">
            <div>
              <div className="text-3xl font-bold">{game.participants?.length || 0}</div>
              <div className="text-orange-100 text-sm">Participants</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{game.budget} {game.currency}</div>
              <div className="text-orange-100 text-sm">Budget</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {game.drawPerformedAt ? (
                  <>
                    <Check className="w-6 h-6 text-green-300" />
                    <span className="text-sm">Tiré ✓</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-6 h-6" />
                    <span className="text-sm">En attente</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Wishlist Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Ma Wishlist</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Ajoutez vos cadeaux préférés pour aider votre Secret Santa! 🎁
            </p>

            {/* Status Messages */}
            {saveStatus === 'saving' && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-800">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-800 rounded-full animate-spin"></div>
                Sauvegarde en cours...
              </div>
            )}
            {saveStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                <Check className="w-5 h-5" />
                Wishlist sauvegardée avec succès!
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                Erreur lors de la sauvegarde
              </div>
            )}

            {/* Wishlist Items */}
            <div className="space-y-4 mb-6">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 items-end"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cadeau
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Nintendo Switch"
                      value={item.name}
                      onChange={(e) => handleWishlistChange(item.id, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.price}
                      onChange={(e) => handleWishlistChange(item.id, 'price', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeWishlistItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={addWishlistItem}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition"
            >
              <Plus className="w-5 h-5" />
              Ajouter un cadeau
            </button>

            {/* Save Button */}
            <button
              onClick={handleSaveWishlist}
              disabled={saveStatus === 'saving'}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition"
            >
              💾 Sauvegarder ma wishlist
            </button>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Assignment Card */}
            {game.drawPerformedAt && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">Mon assignation</h3>
                </div>
                
                {assignedParticipant ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border-2 border-green-200"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {assignedParticipant.name?.[0]}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Tu dois offrir un cadeau à:</p>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      {assignedParticipant.name}
                    </p>
                    {assignedParticipant.wishlistItems?.length > 0 && (
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Sa wishlist:</p>
                        <ul className="space-y-1">
                          {assignedParticipant.wishlistItems.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                              {item.name || '(Pas de nom)'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center text-yellow-800">
                    <p className="text-sm">Le tirage s'est mal déroulé. Contactez l'organisateur.</p>
                  </div>
                )}
              </div>
            )}

            {/* Participants Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Participants ({game.participants?.length || 0})</h3>
              </div>
              
              <div className="space-y-2">
                {game.participants?.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex items-center gap-3 transition ${
                      p.accessCode === accessCode
                        ? 'bg-orange-100 border-2 border-orange-600'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      p.accessCode === accessCode
                        ? 'bg-orange-600'
                        : 'bg-gray-400'
                    }`}>
                      {p.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {p.name}
                        {p.accessCode === accessCode && <span className="text-orange-600 ml-2">(Vous)</span>}
                      </p>
                    </div>
                    {p.wishlistItems?.length > 0 && (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Informations</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Gift className="w-4 h-4 text-orange-600" />
                  <span><strong>Code:</strong> {game.code}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span><strong>Créée:</strong> {new Date(game.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
