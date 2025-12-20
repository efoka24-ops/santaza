import axios from 'axios'

const API_URL = 'http://127.0.0.1:3000/api'

async function testAuth() {
  try {
    console.log('🧪 Test 1: Login admin')
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'Admin@2025'
    })
    console.log('✅ Login success:', loginRes.data)
    const token = loginRes.data.token

    console.log('\n🧪 Test 2: Verify token')
    const verifyRes = await axios.post(`${API_URL}/auth/verify`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('✅ Token valid:', verifyRes.data)

    console.log('\n🧪 Test 3: Login with wrong credentials')
    try {
      await axios.post(`${API_URL}/auth/login`, {
        username: 'admin',
        password: 'wrong'
      })
    } catch (err) {
      console.log('✅ Correctly rejected:', err.response.data)
    }

    console.log('\n✅ All auth tests passed!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testAuth()
