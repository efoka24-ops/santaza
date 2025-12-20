import { motion } from 'framer-motion'
import { CheckCircle, Gift, Share2, Heart } from 'lucide-react'

export default function WishlistGuide() {
  const steps = [
    {
      number: 1,
      title: 'Rejoindre une partie',
      description: 'Accédez à la page "Rejoindre une partie" et entrez le code fourni par l\'organisateur',
      icon: Share2,
      color: 'blue'
    },
    {
      number: 2,
      title: 'Remplir votre wishlist',
      description: 'Entrez jusqu\'à 3 cadeaux que vous aimeriez recevoir avec nom, description et budget en FCFA',
      icon: Gift,
      color: 'orange'
    },
    {
      number: 3,
      title: 'Enregistrer votre wishlist',
      description: 'Cliquez sur "Enregistrer ma wishlist" pour sauvegarder vos données',
      icon: CheckCircle,
      color: 'green'
    },
    {
      number: 4,
      title: 'Attendre le tirage',
      description: 'Une fois que tous les participants ont rempli leur wishlist, l\'organisateur effectue le tirage',
      icon: Heart,
      color: 'red'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Comment enregistrer votre wishlist?</h1>
          <p className="text-lg text-gray-600">Guide étape par étape pour participer au Secret Santa</p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const colorMap = {
              blue: 'from-blue-500 to-blue-600',
              orange: 'from-orange-500 to-orange-600',
              green: 'from-green-500 to-green-600',
              red: 'from-red-500 to-red-600'
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-6 p-8">
                  <div className={`bg-gradient-to-br ${colorMap[step.color]} text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0`}>
                    <Icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Étape {step.number}: {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="text-4xl font-bold text-gray-200">{step.number}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-orange-50 border-2 border-orange-200 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-3">💾 Vos données sont sauvegardées</h2>
          <p className="text-gray-700 mb-4">
            Dès que vous cliquez sur "Enregistrer ma wishlist", vos données sont sauvegardées dans votre navigateur au format JSON. Vous pouvez revenir modifier votre wishlist à tout moment avant le tirage.
          </p>
          <p className="text-sm text-gray-600">
            Votre wishlist est stockée de manière sécurisée et sera partagée uniquement avec votre Secret Santa après le tirage.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
