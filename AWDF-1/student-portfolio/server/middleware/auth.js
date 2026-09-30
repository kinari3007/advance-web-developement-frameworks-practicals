'use strict'

const jwt = require('jsonwebtoken')

/**
 * authenticate — JWT authentication middleware (Practical 7)
 *
 * Reads:  Authorization: Bearer <token>
 * Sets:   req.user = decoded JWT payload  { id: userId }
 * Calls:  next() on success
 * Returns 401 on missing, invalid, or expired token.
 *
 * jwt.verify() is wrapped in try/catch so an invalid token
 * never crashes the server.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  // 1. Header must exist and follow "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = authHeader.slice(7).trim()   // remove "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is empty.' })
  }

  // 2. Verify signature and expiry — wrapped in try/catch per Practical 7 requirement
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded    // { id, iat, exp }
    next()
  } catch (err) {
    // Distinguish expired vs genuinely invalid for logging (never exposed to client)
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' })
    }
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

module.exports = authenticate
