import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCreatedGame, setHasCreatedGame] = useState(false)

  useEffect(() => {
    // Vérifie si l'utilisateur a créé une partie
    const createdGames = localStorage.getItem('userCreatedGames')
    setHasCreatedGame(createdGames === 'true')
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-orange-600 transition">Accueil</Link>
          {hasCreatedGame && (
            <Link to="/my-games" className="text-gray-700 hover:text-orange-600 transition font-semibold">Mes parties</Link>
          )}
          <Link to="/how-it-works" className="text-gray-700 hover:text-orange-600 transition">Comment ça marche</Link>
          <Link to="/faq" className="text-gray-700 hover:text-orange-600 transition">FAQ</Link>
          <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition">Contact</Link>
          <Link to="/create" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-semibold">
            Créer une partie
          </Link>
          <Link to="/admin/login" className="text-gray-700 hover:text-orange-600 transition text-xs opacity-60">
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-orange-600">Accueil</Link>
            {hasCreatedGame && (
              <Link to="/my-games" className="block text-gray-700 hover:text-orange-600 font-semibold">Mes parties</Link>
            )}
            <Link to="/how-it-works" className="block text-gray-700 hover:text-orange-600">Comment ça marche</Link>
            <Link to="/faq" className="block text-gray-700 hover:text-orange-600">FAQ</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-orange-600">Contact</Link>
            <Link to="/create" className="block bg-orange-600 text-white px-6 py-2 rounded-lg text-center font-semibold">
              Créer une partie
            </Link>
            <Link to="/admin/login" className="block text-gray-500 hover:text-orange-600 text-sm">
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
