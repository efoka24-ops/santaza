import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  validateStatus: () => true
})

console.log('🧪 TEST API - Accès à une partie\n')

async function test() {
  try {
    console.log('1️⃣ GET /api/games')
    const gamesRes = await api.get('/games')
    console.log('Status:', gamesRes.status)
    console.log('Games:', gamesRes.data)
    
    if (gamesRes.data.length > 0) {
      const code = gamesRes.data[0].code
      console.log(`\n2️⃣ GET /api/games/${code}`)
      const gameRes = await api.get(`/games/${code}`)
      console.log('Status:', gameRes.status)
      console.log('Game:', JSON.stringify(gameRes.data, null, 2))
    }
  } catch (err) {
    console.error('❌ Erreur:', err.message)
  }
}

test()
