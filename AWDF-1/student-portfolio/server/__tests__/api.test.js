'use strict'

/**
 * api.test.js — Practical 12: Automated API tests
 *
 * Test strategy: all tests target middleware that fires BEFORE any MongoDB
 * call reaches the database layer. This means:
 *   - No live MongoDB connection is needed.
 *   - No external service, mock, or test database is required.
 *   - Tests verify real application behavior (authentication, validation,
 *     Content-Type enforcement, routing) — not mocked stubs.
 *
 * server.js exports the configured Express `app` without starting a listener
 * (guarded by `require.main === module` — Practical 12 testability change).
 * Supertest creates an in-process HTTP server per request, so no port is
 * occupied and nothing needs to be cleaned up.
 *
 * Covered endpoints and middleware:
 *   requireJson     — Content-Type enforcement on POST/PUT
 *   validateRegister — Input validation before DB (POST /register)
 *   validateLogin   — Input validation before DB (POST /login)
 *   authenticate    — JWT verification before any task route (GET /tasks, POST /tasks)
 *   404 fallback    — Unknown routes
 */

const request = require('supertest')
const app     = require('../server')

// ─────────────────────────────────────────────────────────────────────────────
// POST /register  — public route, validated by validateRegister middleware
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /register — input validation (no DB required)', () => {

  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({ password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' })
      ])
    )
  })

  test('returns 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'not-an-email', password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' })
      ])
    )
  })

  test('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'user@example.com' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'password' })
      ])
    )
  })

  test('returns 400 when password is shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'user@example.com', password: 'abc' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'password' })
      ])
    )
  })

  test('returns 415 when Content-Type is not application/json', async () => {
    const res = await request(app)
      .post('/register')
      .set('Content-Type', 'text/plain')
      .send('email=user@example.com&password=password123')

    expect(res.status).toBe(415)
    expect(res.body).toHaveProperty('error', 'Content-Type must be application/json')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// POST /login  — public route, validated by validateLogin middleware
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /login — input validation (no DB required)', () => {

  test('returns 400 when both email and password are missing', async () => {
    const res = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
  })

  test('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({ password: 'password123' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Validation failed')
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' })
      ])
    )
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// GET /tasks  — protected route, authenticate middleware
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /tasks — authentication required (no DB required)', () => {

  test('returns 401 when Authorization header is absent', async () => {
    const res = await request(app).get('/tasks')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('returns 401 when Authorization header is malformed (no Bearer prefix)', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', 'Basic sometoken')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('returns 401 when token is present but cryptographically invalid', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', 'Bearer this.is.not.a.valid.jwt')

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// POST /tasks  — protected route, authenticate fires before validateCreateTask
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /tasks — authentication required (no DB required)', () => {

  test('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send({ title: 'Test task' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  test('returns 415 when Content-Type is wrong (checked before auth)', async () => {
    // requireJson fires before authenticate — 415 is returned before 401
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'text/plain')
      .send('title=Test task')

    expect(res.status).toBe(415)
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// 404 fallback
// ─────────────────────────────────────────────────────────────────────────────

describe('Unknown routes — 404 fallback', () => {

  test('returns 404 for a GET to an unknown path', async () => {
    const res = await request(app).get('/this-route-does-not-exist')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'Route not found')
  })

  test('returns 404 for a POST to an unknown path', async () => {
    const res = await request(app)
      .post('/this-route-does-not-exist')
      .set('Content-Type', 'application/json')
      .send({})

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'Route not found')
  })

})
