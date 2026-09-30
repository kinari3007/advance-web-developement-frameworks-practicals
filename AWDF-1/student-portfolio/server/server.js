'use strict'

// ── Load .env FIRST — must happen before any process.env access ──────────────
require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const mongoose  = require('mongoose')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const Task      = require('./models/Task')
const User      = require('./models/User')
const authenticate              = require('./middleware/auth')
const { validateCreateTask,
        validateUpdateTask,
        validateRegister,
        validateLogin }         = require('./middleware/validate')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidObjectId(str) {
  return mongoose.Types.ObjectId.isValid(str)
}

function formatValidationError(err) {
  const details = Object.values(err.errors).map(e => ({
    field:   e.path,
    message: e.message,
  }))
  return { error: 'Validation failed', details }
}

// ── Global middleware ─────────────────────────────────────────────────────────

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)
  next()
})

app.use(cors())
app.use(express.json())

// Content-Type guard (preserved from Practical 4/5)
function requireJson(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' })
    }
  }
  next()
}
app.use(requireJson)

// ── PUBLIC ROUTES — no token required ────────────────────────────────────────

// POST /register
app.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check for duplicate email
    const existing = await User.findOne({ email: email.trim().toLowerCase() })
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' })
    }

    // Hash password — NEVER store plain text
    const hash = await bcrypt.hash(password, 10)

    const user = new User({ email: email.trim().toLowerCase(), password: hash })
    await user.save()

    // toJSON transform removes the password hash from the response automatically
    res.status(201).json({ message: 'User registered successfully', user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    if (err.code === 11000) {
      // MongoDB duplicate key (race condition fallback)
      return res.status(409).json({ error: 'An account with that email already exists.' })
    }
    next(err)
  }
})

// POST /login
app.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    // Use the same generic message for both "user not found" and "wrong password"
    // to avoid revealing which field was incorrect
    const INVALID_MSG = 'Invalid email or password.'

    if (!user) {
      return res.status(401).json({ error: INVALID_MSG })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: INVALID_MSG })
    }

    // Generate JWT — payload contains only the user id
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Return token — no password or hash
    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
})

// ── PROTECTED ROUTES — authenticate middleware applied to all below ────────────

// GET /me — return current user's safe details
app.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    // toJSON removes password automatically
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

// ── TASK ROUTES — ALL protected by authenticate + validate ────────────────────

// GET /tasks
app.get('/tasks', authenticate, async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 })
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
})

// GET /tasks/:id
app.get('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
})

// POST /tasks
app.post('/tasks', authenticate, validateCreateTask, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' })
    }

    const task = new Task({
      title,
      description: description || '',
      priority:    priority    || 'medium',
    })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    next(err)
  }
})

// PUT /tasks/:id
app.put('/tasks/:id', authenticate, validateUpdateTask, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return res.status(400).json({ error: 'Task title cannot be empty' })
      }
      req.body.title = req.body.title.trim()
    }

    const allowedFields = ['title', 'completed', 'description', 'priority']
    const update = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field]
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    )
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.status(200).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    next(err)
  }
})

// DELETE /tasks/:id
app.delete('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }
    const task = await Task.findByIdAndDelete(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
})

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message)
  if (err.name === 'ValidationError') {
    return res.status(400).json(formatValidationError(err))
  }
  res.status(500).json({ error: 'Something went wrong' })
})

// ── MongoDB → then start server ───────────────────────────────────────────────
const MONGO_URI  = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET

if (!MONGO_URI || MONGO_URI.includes('USERNAME:PASSWORD')) {
  console.error('\n[ERROR] MONGO_URI is not configured in server/.env\n')
  process.exit(1)
}

if (!JWT_SECRET) {
  console.error('\n[ERROR] JWT_SECRET is not configured in server/.env\n')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI, { dbName: 'awdf_tasks' })
  .then(() => {
    console.log('[MongoDB] Connected — database: awdf_tasks')
    app.listen(PORT, () => {
      console.log(`[Server]  Running on http://localhost:${PORT}`)
      console.log(`[Auth]    JWT authentication is active`)
    })
  })
  .catch(err => {
    console.error('[MongoDB] Connection failed:', err.message)
    process.exit(1)
  })
