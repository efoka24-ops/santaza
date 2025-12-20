import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div>
          <Logo />
          <p className="text-gray-400 text-sm mt-4">
            Organisez votre Secret Santa en toute simplicité.
          </p>
        </div>

        {/* Jouer */}
        <div>
          <h4 className="font-bold mb-4">Jouer</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/create" className="hover:text-white transition">Créer une partie</Link></li>
            <li><Link to="/join" className="hover:text-white transition">Rejoindre une partie</Link></li>
          </ul>
        </div>

        {/* Aide */}
        <div>
          <h4 className="font-bold mb-4">Aide</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/how-it-works" className="hover:text-white transition">Comment ça marche</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="font-bold mb-4">Légal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>© 2025 Santaza. Tous droits réservés. Made by Orange ❤️</p>
        </div>
      </div>
    </footer>
  )
}
