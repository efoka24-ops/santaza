#!/usr/bin/env node

/**
 * Script de test complet de l'API Santaza
 */

import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:3000/api'
const client = axios.create({ baseURL: BASE_URL, validateStatus: () => true })

// Utilitaires
const makeRequest = async (method, endpoint, body = null) => {
  try {
    const response = await client({
      method,
      url: endpoint,
      data: body
    })
    return { status: response.status, data: response.data }
  } catch (error) {
    console.error('ERREUR:', error.message, error.code)
    return { status: 'ERROR', data: error.message }
  }
}

const log = (title, result) => {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`✅ ${title}`)
  console.log(`${'='.repeat(60)}`)
  console.log(JSON.stringify(result, null, 2))
}

// Tests
const runTests = async () => {
  let gameCode = null
  let participantAccessCode = null

  // 1. POST /api/games - Créer une partie
  console.log('\n📝 TEST 1: Créer une partie')
  const createGameResult = await makeRequest('POST', '/games', {
    name: 'Noël 2025 - Test Complet',
    creator: 'emmanuel@example.com',
    budget: 30000,
    currency: 'FCFA'
  })
  log('Créer une partie', createGameResult)
  if (createGameResult.data.code) gameCode = createGameResult.data.code

  // 2. GET /api/games - Lister les parties
  console.log('\n📝 TEST 2: Lister les parties')
  const listGamesResult = await makeRequest('GET', '/games')
  log('Lister les parties', listGamesResult)

  // 3. GET /api/games/:code - Récupérer une partie
  if (gameCode) {
    console.log(`\n📝 TEST 3: Récupérer la partie ${gameCode}`)
    const getGameResult = await makeRequest('GET', `/games/${gameCode}`)
    log(`Récupérer partie ${gameCode}`, getGameResult)
  }

  // 4. POST /api/games/:code/participants - Ajouter un participant
  if (gameCode) {
    console.log(`\n📝 TEST 4: Ajouter un participant`)
    const addParticipantResult = await makeRequest('POST', `/games/${gameCode}/participants`, {
      name: 'Alice',
      email: 'alice@example.com'
    })
    log('Ajouter participant Alice', addParticipantResult)
    if (addParticipantResult.data.accessCode) participantAccessCode = addParticipantResult.data.accessCode

    // Ajouter un 2e participant
    const addParticipant2Result = await makeRequest('POST', `/games/${gameCode}/participants`, {
      name: 'Bob',
      email: 'bob@example.com'
    })
    log('Ajouter participant Bob', addParticipant2Result)
  }

  // 5. GET /api/games/:code/participants - Lister les participants
  if (gameCode) {
    console.log(`\n📝 TEST 5: Lister les participants`)
    const listParticipantsResult = await makeRequest('GET', `/games/${gameCode}/participants`)
    log('Lister participants', listParticipantsResult)
  }

  // 6. PUT /api/games/:code/participants/:accessCode/wishlist - Ajouter une wishlist
  if (gameCode && participantAccessCode) {
    console.log(`\n📝 TEST 6: Ajouter une wishlist pour ${participantAccessCode}`)
    const addWishlistResult = await makeRequest('PUT', `/games/${gameCode}/participants/${participantAccessCode}/wishlist`, {
      wishlistItems: [
        { id: 1, name: 'Livre de science-fiction', description: 'Style cyberpunk', price: 25000 },
        { id: 2, name: 'Écouteurs sans fil', description: 'Noise cancelling', price: 150000 }
      ]
    })
    log('Ajouter wishlist', addWishlistResult)
  }

  // 7. POST /api/games/:code/draw - Effectuer le tirage
  if (gameCode) {
    console.log(`\n📝 TEST 7: Effectuer le tirage Secret Santa`)
    const drawResult = await makeRequest('POST', `/games/${gameCode}/draw`)
    log('Tirage effectué', drawResult)
  }

  // 8. GET /api/games/:code/draws - Récupérer les résultats du tirage
  if (gameCode) {
    console.log(`\n📝 TEST 8: Récupérer les résultats du tirage`)
    const getDrawsResult = await makeRequest('GET', `/games/${gameCode}/draws`)
    log('Résultats tirage', getDrawsResult)
  }

  // 9. Récupérer la partie finale pour vérifier l'intégrité
  if (gameCode) {
    console.log(`\n📝 TEST 9: Vérifier l'intégrité de la partie finale`)
    const finalGameResult = await makeRequest('GET', `/games/${gameCode}`)
    log('Partie finale', finalGameResult)
  }

  console.log('\n✅ TOUS LES TESTS TERMINÉS!\n')
}

// Lancer les tests
runTests()
