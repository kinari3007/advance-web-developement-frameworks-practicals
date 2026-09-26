/**
 * api.js — Centralized API utility for the Task Manager (Practical 6)
 *
 * Single source of truth for the backend base URL.
 * Every function:
 *   - checks response.ok before returning data
 *   - throws a plain Error with a human-readable message on failure
 *   - never silently swallows HTTP errors
 */

const BASE_URL = 'http://localhost:5000'

// ── helpers ────────────────────────────────────────────────────────────────

/**
 * Parse the response body regardless of whether the request succeeded.
 * Atlas/Express always returns JSON, even for 4xx/5xx.
 */
async function parseJson(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

/**
 * Build a descriptive Error from a failed response.
 * Uses the `error` field from the JSON body when present.
 */
async function buildError(res, fallback) {
  const body = await parseJson(res)
  const message = body?.error || body?.message || fallback
  const err = new Error(message)
  err.status = res.status
  return err
}

// ── public API functions ────────────────────────────────────────────────────

/**
 * GET /tasks
 * Returns an array of task objects.
 */
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`)
  if (!res.ok) throw await buildError(res, 'Unable to load tasks.')
  return res.json()
}

/**
 * POST /tasks
 * @param {{ title: string, description?: string, priority?: string }} task
 * Returns the newly created task object (with `id` from MongoDB).
 */
export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(task),
  })
  if (!res.ok) throw await buildError(res, 'Unable to create task.')
  return res.json()
}

/**
 * PUT /tasks/:id
 * @param {string}  id      MongoDB task id (string)
 * @param {object}  fields  Fields to update — any of { title, description, completed, priority }
 * Returns the updated task object.
 */
export async function updateTask(id, fields) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(fields),
  })
  if (!res.ok) throw await buildError(res, 'Unable to update task.')
  return res.json()
}

/**
 * DELETE /tasks/:id
 * @param {string} id  MongoDB task id (string)
 * Returns the server response object { message: '...' }.
 */
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw await buildError(res, 'Unable to delete task.')
  return res.json()
}
