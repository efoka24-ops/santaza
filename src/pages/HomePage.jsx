import { Clock, Gift, Lock, RefreshCw, Users, Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { gamesAPI } from '../services/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setIsLoading(true)
      const allGames = await gamesAPI.getAll()
      setGames(allGames || [])
    } catch (error) {
      console.error('Erreur chargement parties:', error)
      setGames([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full inline-block mb-6">
            <span className="text-sm font-medium">🎁 Secret Santa en ligne</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Organisez votre <span className="text-orange-600">Amis Invisibles</span> en 2 minutes
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Créez, invitez et faites le tirage au sort automatiquement. Wishlists, budget conseillé et messages secrets inclus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a href="/create" className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition text-center">
              Créer une partie →
            </a>
            <button 
              onClick={() => navigate('/join')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-orange-600 transition"
            >
              Rejoindre une partie
            </button>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>100% gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Sans inscription</span>
            </div>
          </div>
        </motion.div>

        {/* Game Preview Card or Games List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Parties disponibles</h3>
            <button
              onClick={loadGames}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin text-orange-600' : ''} />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-2" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Aucune partie disponible</p>
              <button
                onClick={() => navigate('/create')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Créer la première
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {games.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition cursor-pointer group"
                  onClick={() => navigate(`/game/${game.code}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition">
                        {game.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {game.participants?.length || 0} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Gift size={14} />
                          Code: <span className="font-mono font-bold">{game.code}</span>
                        </div>
                        {game.drawPerformedAt && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            ✓ Tiré
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="text-orange-600 group-hover:translate-x-1 transition" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <a 
              href="/create"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center block"
            >
              ➕ Créer une nouvelle partie
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Pourquoi choisir Amis Invisibles ?</h2>
          <p className="text-center text-gray-600 mb-12">
            Une solution simple et élégante pour organiser votre échange de cadeaux
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Rapide</h3>
              <p className="text-gray-600">Création en moins de 2 minutes. Simple et efficace.</p>
            </div>

            <div className="text-center p-8">
              <Gift className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Personnalisable</h3>
              <p className="text-gray-600">Wishlists, budgets, exclusions — tout est configurable.</p>
            </div>

            <div className="text-center p-8">
              <Lock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">100% Anonyme</h3>
              <p className="text-gray-600">Le tirage est équitable et totalement anonyme.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Comment ça marche ?</h2>
        <p className="text-center text-gray-600 mb-12">
          4 étapes simples pour organiser votre Secret Santa
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { num: '01', title: 'Créez votre partie', desc: 'Configurez le nom du groupe et la date d\'échange' },
            { num: '02', title: 'Invitez vos amis', desc: 'Partagez le lien et recevez les confirmations' },
            { num: '03', title: 'Wishlists', desc: 'Chaque participant ajoute ses souhaits' },
            { num: '04', title: 'Tirage automatique', desc: 'Le système fait le tirage de manière équitable' }
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-red-600 font-semibold hover:underline">En savoir plus →</a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16 rounded-2xl max-w-4xl mx-auto mb-20">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-4">Prêt à jouer ?</h2>
          <p className="text-orange-100 mb-8">
            Créez votre groupe, invitez vos amis et laissez la magie opérer.
          </p>
          <a href="/create" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition inline-block">
            Créer ma partie gratuitement →
          </a>
        </div>
      </section>
    </div>
  )
}
