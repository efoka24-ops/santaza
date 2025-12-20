import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DatabaseViewer() {
  const navigate = useNavigate()
  const [userGames, setUserGames] = useState([])
  const [games, setGames] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const userGamesData = JSON.parse(localStorage.getItem('userGames') || '[]')
    const gamesData = JSON.parse(localStorage.getItem('games') || '[]')
    setUserGames(userGamesData)
    setGames(gamesData)
  }

  const copyToClipboard = () => {
    const allData = {
      userGames,
      games,
      timestamp: new Date().toISOString()
    }
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJSON = () => {
    const allData = {
      userGames,
      games,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `santaza-db-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const clearAllData = () => {
    if (window.confirm('⚠️ Êtes-vous sûr? Cela supprimera TOUTES les données!')) {
      localStorage.clear()
      setUserGames([])
      setGames([])
    }
  }

  const DataCard = ({ title, data }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-bold text-orange-600 mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Vide</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-orange-600">
                  {item.code || item.name || `Item ${idx + 1}`}
                </span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {item.participants?.length || 0} participants
                </span>
              </div>
              <pre className="bg-white p-3 rounded border border-gray-300 text-xs overflow-x-auto max-h-48 overflow-y-auto">
                {JSON.stringify(item, null, 2)}
              </pre>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Retour
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Database Viewer</h1>
          <p className="text-gray-600">Visualisez toutes les données stockées en localStorage</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-orange-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Parties créées</p>
            <p className="text-3xl font-bold">{userGames.length}</p>
          </div>
          <div className="bg-blue-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Parties rejointes</p>
            <p className="text-3xl font-bold">{games.length}</p>
          </div>
          <div className="bg-green-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Total participants</p>
            <p className="text-3xl font-bold">
              {userGames.reduce((sum, g) => sum + (g.participants?.length || 0), 0) +
               games.reduce((sum, g) => sum + (g.participants?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-purple-600 text-white rounded-lg p-4">
            <p className="text-sm opacity-90">Tirages effectués</p>
            <p className="text-3xl font-bold">
              {userGames.filter(g => g.drawPerformedAt).length +
               games.filter(g => g.drawPerformedAt).length}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Copy size={18} />
            {copied ? 'Copié!' : 'Copier JSON'}
          </button>
          <button
            onClick={downloadJSON}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Download size={18} />
            Télécharger
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            🔄 Rafraîchir
          </button>
          <button
            onClick={clearAllData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition ml-auto"
          >
            <Trash2 size={18} />
            Effacer tout
          </button>
        </motion.div>

        {/* Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataCard title="📝 Mes Parties (userGames)" data={userGames} />
          <DataCard title="📥 Parties Rejointes (games)" data={games} />
        </div>

        {/* Raw JSON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-orange-600 mb-4">📄 JSON Brut</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto text-xs font-mono">
            {JSON.stringify({ userGames, games }, null, 2)}
          </pre>
        </motion.div>
      </div>
    </div>
  )
}
