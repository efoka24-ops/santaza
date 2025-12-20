import { motion } from 'framer-motion'
import { Check, Users, Gift, Zap } from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: 'Créez votre partie',
      description: 'Configurez le nom du groupe, la date d\'échange et le budget conseillé.',
      details: 'L\'organisateur reçoit un code unique pour partager la partie avec les participants.',
      icon: '🎁'
    },
    {
      number: 2,
      title: 'Invitez vos amis',
      description: 'Partagez le code ou le lien avec vos proches.',
      details: 'Les participants rejoignent en entrant le code. Aucune inscription requise!',
      icon: '👥'
    },
    {
      number: 3,
      title: 'Remplissez les wishlists',
      description: 'Chaque participant ajoute jusqu\'à 3 cadeaux souhaités.',
      details: 'Description, priorité, prix approximatif - tout est personnalisable.',
      icon: '📝'
    },
    {
      number: 4,
      title: 'Tirage automatique',
      description: 'L\'organisateur lance le tirage équitable et anonyme.',
      details: 'Le système garantit que personne ne se tire à soi-même.',
      icon: '🎯'
    },
    {
      number: 5,
      title: 'Découvrez votre destinataire',
      description: 'Chaque participant voit anonymement qui il doit gâter.',
      details: 'Accédez à la wishlist complète et envoyez des messages anonymes.',
      icon: '🎉'
    },
    {
      number: 6,
      title: 'Échangez les cadeaux!',
      description: 'Le jour J, surprenez votre destinataire avec un cadeau personnalisé.',
      details: 'L\'email de l\'organisateur reste secret jusqu\'à la fin.',
      icon: '🎄'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Comment ça marche ?</h1>
          <p className="text-xl text-orange-100">
            6 étapes simples pour organiser votre Secret Santa en toute sérénité
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-600"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3 font-semibold">{step.description}</p>
              <p className="text-gray-600 text-sm">{step.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Highlight */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Pourquoi Santaza ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Ultra rapide', desc: 'Création en 2 minutes chrono' },
              { icon: Gift, title: 'Personnalisable', desc: 'Wishlists, budgets, exclusions' },
              { icon: Users, title: 'Inclusif', desc: 'Pas d\'inscription obligatoire' },
              { icon: Check, title: 'Anonyme', desc: 'Tirage 100% équitable' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <feature.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-orange-100 mb-8">Créez votre première partie en moins de 2 minutes</p>
          <a href="/create" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition inline-block">
            Créer une partie →
          </a>
        </div>
      </section>
    </div>
  )
}
