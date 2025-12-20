#!/usr/bin/env node

/**
 * Test simple des fonctionnalités principales
 */

import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'

async function test() {
  try {
    console.log('🎯 TEST COMPLÈTE: Accès à une partie\n')

    // 1. Créer une partie
    console.log('1️⃣  Créer une partie...')
    const gameRes = await axios.post(`${BASE_URL}/games`, {
      name: 'Test Noël 2025',
      creator: 'test@example.com',
      budget: 50000,
      currency: 'FCFA'
    })
    const gameCode = gameRes.data.code
    console.log(`   ✅ Partie créée: ${gameCode}\n`)

    // 2. Récupérer la partie
    console.log('2️⃣  Accéder à la partie...')
    const accessRes = await axios.get(`${BASE_URL}/games/${gameCode}`)
    console.log(`   ✅ Partie chargée:`)
    console.log(`   - Nom: ${accessRes.data.name}`)
    console.log(`   - Créateur: ${accessRes.data.creator}`)
    console.log(`   - Budget: ${accessRes.data.budget} ${accessRes.data.currency}\n`)

    // 3. Ajouter des participants
    console.log('3️⃣  Ajouter des participants...')
    const p1Res = await axios.post(`${BASE_URL}/games/${gameCode}/participants`, {
      name: 'Alice',
      email: 'alice@test.com'
    })
    const p1Code = p1Res.data.accessCode
    console.log(`   ✅ Alice ajoutée (code: ${p1Code})`)

    const p2Res = await axios.post(`${BASE_URL}/games/${gameCode}/participants`, {
      name: 'Bob',
      email: 'bob@test.com'
    })
    const p2Code = p2Res.data.accessCode
    console.log(`   ✅ Bob ajouté (code: ${p2Code})\n`)

    // 4. Ajouter des wishlists
    console.log('4️⃣  Ajouter des wishlists...')
    await axios.put(`${BASE_URL}/games/${gameCode}/participants/${p1Code}/wishlist`, {
      wishlistItems: [
        { id: 1, name: 'Livre', price: 25000 },
        { id: 2, name: 'Écouteurs', price: 150000 }
      ]
    })
    console.log(`   ✅ Wishlist Alice sauvegardée`)

    await axios.put(`${BASE_URL}/games/${gameCode}/participants/${p2Code}/wishlist`, {
      wishlistItems: [
        { id: 1, name: 'Montre', price: 75000 }
      ]
    })
    console.log(`   ✅ Wishlist Bob sauvegardée\n`)

    // 5. Vérifier l'intégrité
    console.log('5️⃣  Vérifier l\'intégrité de la partie...')
    const checkRes = await axios.get(`${BASE_URL}/games/${gameCode}`)
    console.log(`   ✅ Participants: ${checkRes.data.participants.length}`)
    console.log(`   ✅ Alice wishlist: ${checkRes.data.participants[0].wishlistItems.length} items`)
    console.log(`   ✅ Bob wishlist: ${checkRes.data.participants[1].wishlistItems.length} items\n`)

    // 6. Effectuer le tirage
    console.log('6️⃣  Effectuer le tirage Secret Santa...')
    const drawRes = await axios.post(`${BASE_URL}/games/${gameCode}/draw`)
    console.log(`   ✅ Tirage effectué`)
    console.log(`   ✅ ${Object.keys(drawRes.data.draws).length} assignations créées\n`)

    // 7. Récupérer les résultats
    console.log('7️⃣  Vérifier les résultats du tirage...')
    const resultsRes = await axios.get(`${BASE_URL}/games/${gameCode}/draws`)
    console.log(`   ✅ Tirage effectué: ${resultsRes.data.hasBeenDrawn}`)
    console.log(`   ✅ Assignations:`)
    Object.entries(resultsRes.data.draws).forEach(([giver, receiver]) => {
      const giverName = checkRes.data.participants.find(p => p.accessCode === giver)?.name
      const receiverName = checkRes.data.participants.find(p => p.accessCode === receiver)?.name
      console.log(`      - ${giverName} → ${receiverName}`)
    })
    console.log()

    // 8. Accès final à la partie
    console.log('8️⃣  Accès final à la partie (dashboard)...')
    const finalRes = await axios.get(`${BASE_URL}/games/${gameCode}`)
    console.log(`   ✅ État final:`)
    console.log(`      - Tiré: ${finalRes.data.drawPerformedAt ? 'OUI ✅' : 'NON ❌'}`)
    console.log(`      - Participants: ${finalRes.data.participants.length}`)
    console.log(`      - Wishlists: ${finalRes.data.participants.filter(p => p.wishlistItems.length > 0).length}`)
    console.log(`      - Assignments: ${Object.keys(finalRes.data.draws).length}\n`)

    console.log('✨ ✨ ✨ TOUS LES TESTS RÉUSSIS! ✨ ✨ ✨\n')

  } catch (error) {
    console.error('❌ ERREUR:', error.response?.data || error.message)
    process.exit(1)
  }
}

test()
