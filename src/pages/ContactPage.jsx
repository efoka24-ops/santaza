import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Nous Contacter</h1>
          <p className="text-xl text-orange-100">
            Une question ? Nous sommes là pour vous aider !
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-green-700 font-semibold text-lg">✓ Message envoyé avec succès !</p>
                <p className="text-green-600 mt-2">Nous vous répondrons dans les 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Prénom Nom"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Votre email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="vous@exemple.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Problème technique"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre question ou problème..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres moyens de nous contacter</h2>

              {/* Email */}
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-200">
                <Mail className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:support@santaza.fr" className="text-orange-600 hover:underline">
                    support@santaza.fr
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Réponse en moins de 24h</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-200">
                <Phone className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Téléphone</h3>
                  <a href="tel:+33123456789" className="text-orange-600 hover:underline">
                    +33 (0)1 23 45 67 89
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Du lundi au vendredi, 9h-18h</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-200">
                <MessageSquare className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Réseaux sociaux</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <a href="#" className="block text-orange-600 hover:underline">Facebook</a>
                    <a href="#" className="block text-orange-600 hover:underline">Instagram</a>
                    <a href="#" className="block text-orange-600 hover:underline">Twitter</a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Adresse</h3>
                  <p className="text-gray-600 text-sm">
                    Orange<br/>
                    Paris, France
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Avez-vous consulté notre FAQ ?</h3>
              <p className="text-gray-600 text-sm mb-4">
                La plupart des questions y sont déjà répondues.
              </p>
              <a href="/faq" className="text-orange-600 hover:underline font-semibold">
                Consulter la FAQ →
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
