// Manual test script for POST /ai/generate-description
// Run with: node test-gemini-endpoint.js

'use strict'
require('dotenv').config()

const BASE_URL = 'http://localhost:5000'

async function testEndpoint() {
  console.log('Testing POST /ai/generate-description endpoint...\n')

  // Test 1: Missing title (should return 400)
  console.log('Test 1: Empty title (expect 400)')
  try {
    const res1 = await fetch(`${BASE_URL}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' })
    })
    console.log(`Status: ${res1.status}`)
    const body1 = await res1.json()
    console.log(`Response:`, body1)
    console.log(res1.status === 400 ? '✓ PASS\n' : '✗ FAIL\n')
  } catch (err) {
    console.log('✗ FAIL -', err.message, '\n')
  }

  // Test 2: Missing auth token (should return 401)
  console.log('Test 2: No auth token (expect 401)')
  try {
    const res2 = await fetch(`${BASE_URL}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test task' })
    })
    console.log(`Status: ${res2.status}`)
    const body2 = await res2.json()
    console.log(`Response:`, body2)
    console.log(res2.status === 401 ? '✓ PASS\n' : '✗ FAIL\n')
  } catch (err) {
    console.log('✗ FAIL -', err.message, '\n')
  }

  console.log('Manual tests complete.')
  console.log('\nTo test with valid auth:')
  console.log('1. Start the backend: npm start')
  console.log('2. Start the frontend: npm run dev')
  console.log('3. Register/login in the browser')
  console.log('4. Type a task title and click "Generate description with AI"')
}

testEndpoint()
