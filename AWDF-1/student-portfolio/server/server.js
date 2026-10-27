'use strict'

// ── Load .env FIRST — must happen before any process.env access ──────────────
require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const mongoose  = require('mongoose')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const NodeCache = require('node-cache')

const Task      = require('./models/Task')
const User      = require('./models/User')
const authenticate              = require('./middleware/auth')
const { validateCreateTask,
        validateUpdateTask,
        validateRegister,
        validateLogin }         = require('./middleware/validate')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Practical 9: In-Memory Cache ──────────────────────────────────────────────
//
// A single shared NodeCache instance with a 60-second default TTL.
// All task routes in this server use this instance.
//
// Cache key design:
//   all_tasks       → result of GET /tasks  (Task.find().sort())
//   task_<id>       → result of GET /tasks/:id  (Task.findById)
//
// Task data is NOT user-scoped in this application (the Task schema has no
// userId field and all authenticated users share the same collection), so a
// single shared key per query shape is correct and safe.
//
// Invalidation rules:
//   POST /tasks          → del all_tasks
//   PUT  /tasks/:id      → del all_tasks + del task_<id>
//   DELETE /tasks/:id    → del all_tasks + del task_<id>
//
// The cache is only populated / invalidated AFTER a successful DB operation.
// Failed writes never touch the cache.

const cache = new NodeCache({
  stdTTL:      60,    // default TTL in seconds
  checkperiod: 10,    // background sweep every 10 s to evict expired keys
  useClones:   false, // return references — fine for read-only consumers
})

// ── Cache statistics counters ─────────────────────────────────────────────────
// Simple in-process counters incremented on every cache interaction.
// Reset to 0 when the server restarts (by design — in-memory only).
const stats = {
  hits:   0,
  misses: 0,
}

// Convenience helpers so every route uses consistent key names
const CACHE_KEY = {
  allTasks: 'all_tasks',
  task:     (id) => `task_${id}`,
}

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

    const existing = await User.findOne({ email: email.trim().toLowerCase() })
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = new User({ email: email.trim().toLowerCase(), password: hash })
    await user.save()

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    if (err.code === 11000) {
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

    const INVALID_MSG = 'Invalid email or password.'
    if (!user) return res.status(401).json({ error: INVALID_MSG })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: INVALID_MSG })

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
})

// ── PROTECTED ROUTES ──────────────────────────────────────────────────────────

// GET /me
app.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

// ── Practical 9: Debug endpoint — cache statistics ───────────────────────────
//
// GET /debug/cache-stats
// Protected by authenticate so it cannot be accessed without a valid JWT.
// Returns the live hit/miss counters and current key inventory.
// Never exposes task data, user data, or credentials.

app.get('/debug/cache-stats', authenticate, (req, res) => {
  const keys        = cache.keys()
  const total       = stats.hits + stats.misses
  const hitRate     = total === 0
    ? '0.00'
    : ((stats.hits / total) * 100).toFixed(2)

  res.status(200).json({
    cache: {
      hits:       stats.hits,
      misses:     stats.misses,
      total:      total,
      hitRate:    `${hitRate}%`,
      keyCount:   keys.length,
      keys:       keys,           // shows e.g. ["all_tasks", "task_<id>"]
      ttlSeconds: 60,
    },
  })
})

// ── TASK ROUTES — ALL protected by authenticate ───────────────────────────────

// GET /tasks
// ─ Check cache first.
// ─ On hit:  increment stats.hits, return cached array immediately.
// ─ On miss: query MongoDB, store result, increment stats.misses, return array.
app.get('/tasks', authenticate, async (req, res, next) => {
  try {
    const key    = CACHE_KEY.allTasks
    const cached = cache.get(key)

    if (cached !== undefined) {
      // ── CACHE HIT ──────────────────────────────────────────────────────────
      stats.hits++
      console.log(`[Cache] HIT  ${key}  (hits=${stats.hits} misses=${stats.misses})`)
      return res.status(200).json(cached)
    }

    // ── CACHE MISS ────────────────────────────────────────────────────────────
    stats.misses++
    console.log(`[Cache] MISS ${key}  (hits=${stats.hits} misses=${stats.misses})`)

    const tasks = await Task.find().sort({ createdAt: 1 })

    // Store the plain JS objects (toJSON-transformed) so consumers always get
    // the same shape whether reading from cache or MongoDB.
    const taskData = tasks.map(t => t.toJSON())
    cache.set(key, taskData)

    res.status(200).json(taskData)
  } catch (err) {
    next(err)
  }
})

// GET /tasks/:id
// ─ Uses a per-task cache key: task_<id>
// ─ Same hit/miss pattern as GET /tasks.
// ─ Invalid ObjectId and missing-task errors are NOT cached.
app.get('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    const key    = CACHE_KEY.task(id)
    const cached = cache.get(key)

    if (cached !== undefined) {
      // ── CACHE HIT ──────────────────────────────────────────────────────────
      stats.hits++
      console.log(`[Cache] HIT  ${key}  (hits=${stats.hits} misses=${stats.misses})`)
      return res.status(200).json(cached)
    }

    // ── CACHE MISS ────────────────────────────────────────────────────────────
    stats.misses++
    console.log(`[Cache] MISS ${key}  (hits=${stats.hits} misses=${stats.misses})`)

    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })

    const taskData = task.toJSON()
    cache.set(key, taskData)

    res.status(200).json(taskData)
  } catch (err) {
    next(err)
  }
})

// POST /tasks
// ─ Creates the task in MongoDB.
// ─ On success: invalidates all_tasks so the next GET reflects the new task.
//   (Individual-task cache is not pre-populated on create — the next GET /:id
//    will populate it on the first access.)
// ─ Cache is NOT touched if the DB write fails.
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

    // ── Invalidate after successful write ─────────────────────────────────────
    cache.del(CACHE_KEY.allTasks)
    console.log(`[Cache] INVALIDATED ${CACHE_KEY.allTasks} after POST /tasks`)

    res.status(201).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    next(err)
  }
})

// PUT /tasks/:id
// ─ Updates the document in MongoDB.
// ─ On success: invalidates both all_tasks and task_<id> so stale data is
//   never served from either cache entry.
// ─ Cache is NOT touched if the DB write fails or the task is not found.
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

    // ── Invalidate after successful write ─────────────────────────────────────
    cache.del(CACHE_KEY.allTasks)
    cache.del(CACHE_KEY.task(id))
    console.log(`[Cache] INVALIDATED ${CACHE_KEY.allTasks} + ${CACHE_KEY.task(id)} after PUT /tasks/${id}`)

    res.status(200).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    next(err)
  }
})

// DELETE /tasks/:id
// ─ Deletes from MongoDB.
// ─ On success: invalidates both all_tasks and task_<id>.
// ─ Cache is NOT touched if the task is not found or the delete fails.
app.delete('/tasks/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    const task = await Task.findByIdAndDelete(id)
    if (!task) return res.status(404).json({ error: 'Task not found' })

    // ── Invalidate after successful write ─────────────────────────────────────
    cache.del(CACHE_KEY.allTasks)
    cache.del(CACHE_KEY.task(id))
    console.log(`[Cache] INVALIDATED ${CACHE_KEY.allTasks} + ${CACHE_KEY.task(id)} after DELETE /tasks/${id}`)

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
      console.log(`[Cache]   node-cache active — TTL=60s  debug: GET /debug/cache-stats`)
    })
  })
  .catch(err => {
    console.error('[MongoDB] Connection failed:', err.message)
    process.exit(1)
  })
