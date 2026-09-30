/**
 * api.js — Centralized API utility (Practical 6 + Practical 7)
 *
 * Single source of truth for the backend base URL.
 * All task routes are protected — the Authorization header is injected automatically.
 * Auth functions (register / login) are public — no token needed.
 */

const BASE_URL = 'http://localhost:5000'

// ── Token storage helpers ─────────────────────────────────────────────────────
// sessionStorage keeps the token for the browser session only.
// It is automatically cleared when the tab/browser is closed.

const TOKEN_KEY = 'awdf_token'

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function parseJson(res) {
  try { return await res.json() } catch { return {} }
}

async function buildError(res, fallback) {
  const body = await parseJson(res)
  const message = body?.error || body?.message || fallback
  const err = new Error(message)
  err.status = res.status
  return err
}

/**
 * Returns headers for authenticated requests.
 * Always includes Content-Type and the Bearer token when one is stored.
 */
function authHeaders() {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

// ── Public auth functions ─────────────────────────────────────────────────────

/**
 * POST /register
 * @param {{ email: string, password: string }} credentials
 */
export async function register({ email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })
  if (!res.ok) throw await buildError(res, 'Registration failed.')
  return res.json()
}

/**
 * POST /login
 * @param {{ email: string, password: string }} credentials
 * Returns { token } on success — caller must call saveToken(token).
 */
export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })
  if (!res.ok) throw await buildError(res, 'Login failed. Check your email and password.')
  return res.json()    // { token }
}

/**
 * GET /me  — protected
 * Returns the currently logged-in user's safe details (no password).
 */
export async function getMe() {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw await buildError(res, 'Unable to fetch user details.')
  return res.json()
}

// ── Protected task functions ──────────────────────────────────────────────────
// Every function below sends Authorization: Bearer <token> automatically.
// If the server returns 401, the error's .status property will be 401 —
// the caller (TodoPage) checks this and triggers logout.

/**
 * GET /tasks
 */
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw await buildError(res, 'Unable to load tasks.')
  return res.json()
}

/**
 * POST /tasks
 * @param {{ title: string, description?: string, priority?: string }} task
 */
export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify(task),
  })
  if (!res.ok) throw await buildError(res, 'Unable to create task.')
  return res.json()
}

/**
 * PUT /tasks/:id
 * @param {string} id     MongoDB task id
 * @param {object} fields Fields to update
 */
export async function updateTask(id, fields) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method:  'PUT',
    headers: authHeaders(),
    body:    JSON.stringify(fields),
  })
  if (!res.ok) throw await buildError(res, 'Unable to update task.')
  return res.json()
}

/**
 * DELETE /tasks/:id
 * @param {string} id  MongoDB task id
 */
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method:  'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw await buildError(res, 'Unable to delete task.')
  return res.json()
}
