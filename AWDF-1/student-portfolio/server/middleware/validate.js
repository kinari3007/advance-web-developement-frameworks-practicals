'use strict'

/**
 * validate.js — Server-side request validation middleware (Practical 7)
 *
 * Validates incoming request bodies BEFORE they reach task controllers or MongoDB.
 * Returns HTTP 400 with a structured JSON error if validation fails.
 *
 * Format:
 *   { "error": "Validation failed", "details": [{ "field": "...", "message": "..." }] }
 */

const VALID_PRIORITIES = ['low', 'medium', 'high']

// ── helpers ──────────────────────────────────────────────────────────────────

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function sendValidationError(res, details) {
  return res.status(400).json({ error: 'Validation failed', details })
}

// ── POST /tasks ───────────────────────────────────────────────────────────────

/**
 * validateCreateTask
 * Rules:
 *   title       — required, non-empty string
 *   description — optional, but must be a string if supplied
 *   priority    — optional, but must be 'low'|'medium'|'high' if supplied
 *   completed   — must be boolean if supplied
 */
function validateCreateTask(req, res, next) {
  const { title, description, priority, completed } = req.body || {}
  const details = []

  // title
  if (title === undefined || title === null) {
    details.push({ field: 'title', message: 'Title is required' })
  } else if (!isNonEmptyString(title)) {
    details.push({ field: 'title', message: 'Title must be a non-empty string' })
  }

  // description (optional)
  if (description !== undefined && typeof description !== 'string') {
    details.push({ field: 'description', message: 'Description must be a string' })
  }

  // priority (optional)
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    details.push({ field: 'priority', message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }

  // completed (optional)
  if (completed !== undefined && typeof completed !== 'boolean') {
    details.push({ field: 'completed', message: 'Completed must be a boolean' })
  }

  if (details.length > 0) return sendValidationError(res, details)
  next()
}

// ── PUT /tasks/:id ────────────────────────────────────────────────────────────

/**
 * validateUpdateTask
 * All fields are optional on update, but each supplied field must be valid.
 */
function validateUpdateTask(req, res, next) {
  const { title, description, priority, completed } = req.body || {}
  const details = []

  // title — if provided must be non-empty string
  if (title !== undefined && !isNonEmptyString(title)) {
    details.push({ field: 'title', message: 'Title must be a non-empty string' })
  }

  // description — if provided must be string
  if (description !== undefined && typeof description !== 'string') {
    details.push({ field: 'description', message: 'Description must be a string' })
  }

  // priority — if provided must be valid enum
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    details.push({ field: 'priority', message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }

  // completed — if provided must be boolean
  if (completed !== undefined && typeof completed !== 'boolean') {
    details.push({ field: 'completed', message: 'Completed must be a boolean' })
  }

  if (details.length > 0) return sendValidationError(res, details)
  next()
}

// ── POST /register ────────────────────────────────────────────────────────────

/**
 * validateRegister
 * Rules:
 *   email    — required, string, basic format check
 *   password — required, string, min 6 chars
 */
function validateRegister(req, res, next) {
  const { email, password } = req.body || {}
  const details = []

  if (!isNonEmptyString(email)) {
    details.push({ field: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    details.push({ field: 'email', message: 'Email format is invalid' })
  }

  if (!isNonEmptyString(password)) {
    details.push({ field: 'password', message: 'Password is required' })
  } else if (password.length < 6) {
    details.push({ field: 'password', message: 'Password must be at least 6 characters' })
  }

  if (details.length > 0) return sendValidationError(res, details)
  next()
}

// ── POST /login ───────────────────────────────────────────────────────────────

/**
 * validateLogin
 * Rules:
 *   email    — required, non-empty string
 *   password — required, non-empty string
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body || {}
  const details = []

  if (!isNonEmptyString(email)) {
    details.push({ field: 'email', message: 'Email is required' })
  }

  if (!isNonEmptyString(password)) {
    details.push({ field: 'password', message: 'Password is required' })
  }

  if (details.length > 0) return sendValidationError(res, details)
  next()
}

module.exports = { validateCreateTask, validateUpdateTask, validateRegister, validateLogin }
