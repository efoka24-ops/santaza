import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'Est-ce que l\'inscription est obligatoire ?',
      answer: 'Non ! Aucune inscription n\'est requise. Les participants rejoignent simplement avec leur nom et email.'
    },
    {
      question: 'Comment est généré le code de la partie ?',
      answer: 'Un code unique est généré automatiquement lors de la création de la partie. Vous pouvez le partager par lien, email ou simplement communiquer le code.'
    },
    {
      question: 'Le tirage est-il vraiment anonyme ?',
      answer: 'Oui, 100% anonyme. L\'organisateur ne voit pas les associations. Les participants découvrent seulement qui ils doivent gâter.'
    },
    {
      question: 'Peut-on exclure certaines personnes du tirage ?',
      answer: 'Oui ! Vous pouvez configurer des exclusions (couples, collègues directs, etc.) lors de la création de la partie.'
    },
    {
      question: 'Combien de cadeaux par personne ?',
      answer: 'Jusqu\'à 3 cadeaux par wishlist. C\'est l\'équilibre parfait pour donner des options sans surcharger.'
    },
    {
      question: 'Peut-on modifier la wishlist après ?',
      answer: 'Oui, les participants peuvent modifier leur wishlist à tout moment avant le tirage.'
    },
    {
      question: 'Comment fonctionne le budget conseillé ?',
      answer: 'C\'est juste une recommandation affichée aux participants. Ils sont libres de l\'adapter selon leurs moyens.'
    },
    {
      question: 'Les messages anonymes, comment ça marche ?',
      answer: 'Après le tirage, chaque participant peut envoyer des messages anonymes au destinataire pour poser des questions ou donner des indices.'
    },
    {
      question: 'Peut-on supprimer une partie ?',
      answer: 'Oui, l\'organisateur peut supprimer la partie à tout moment. Toutes les données seront supprimées.'
    },
    {
      question: 'Quel est le coût ?',
      answer: 'Santaza est 100% gratuit ! Aucune limite de participants, aucune publicité, aucun frais caché.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, vos données sont chiffrées et protégées. Nous ne les partageons jamais avec des tiers.'
    },
    {
      question: 'Comment exporter les résultats ?',
      answer: 'L\'organisateur peut exporter la liste des participants et leurs wishlists en CSV pour une sauvegarde personnelle.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Foire Aux Questions</h1>
          <p className="text-xl text-orange-100">
            Trouvez les réponses à vos questions sur Santaza
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition flex items-center justify-between font-semibold text-gray-900"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-orange-600 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-600 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-700 mb-6">
            Notre équipe est là pour vous aider. N\'hésitez pas à nous contacter.
          </p>
          <a href="/contact" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition inline-block">
            Contacter le support →
          </a>
        </motion.div>
      </section>
    </div>
  )
}
