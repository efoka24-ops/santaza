import { Clock } from 'lucide-react'

export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{game.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <Clock size={16} />
            <span>{game.participants} participants • {game.date}</span>
          </div>
        </div>
        <div className="text-2xl">🎄</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-600 text-sm font-semibold mb-3">Participants:</p>
        <div className="flex flex-wrap gap-2">
          {game.participantsList.map((participant, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm">
              <span className={`w-4 h-4 rounded-full ${participant.status === 'done' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
              <span>{participant.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
          Voir les détails
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
          Accéder
        </button>
      </div>
    </div>
  )
}
