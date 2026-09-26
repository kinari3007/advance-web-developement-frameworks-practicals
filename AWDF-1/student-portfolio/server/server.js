'use strict'

// Load environment variables from .env before anything else
require('dotenv').config()

const express  = require('express')
const cors     = require('cors')
const mongoose = require('mongoose')
const Task     = require('./models/Task')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if str is a valid 24-char MongoDB ObjectId hex string */
function isValidObjectId(str) {
  return mongoose.Types.ObjectId.isValid(str)
}

/**
 * Parse a Mongoose ValidationError into the structured format required by
 * Practical 5:
 *   { error: 'Validation failed', details: [{ field, message }] }
 */
function formatValidationError(err) {
  const details = Object.values(err.errors).map((e) => ({
    field:   e.path,
    message: e.message,
  }))
  return { error: 'Validation failed', details }
}

// ── Middleware ────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)
  next()
})

app.use(cors())
app.use(express.json())

// Preserve existing Content-Type guard from Practical 4
function requireJson(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' })
    }
  }
  next()
}

app.use(requireJson)

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /tasks — return all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 })
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
})

// GET /tasks/:id — return single task (Practical 5 supplementary)
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
})

// POST /tasks — create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body || {}

    // Mirror the explicit check from Practical 4 before hitting Mongoose
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' })
    }

    const task = new Task({
      title,                           // pre-save hook trims it
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

// PUT /tasks/:id — update title and/or completed
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    // Validate title if it's being updated
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return res.status(400).json({ error: 'Task title cannot be empty' })
      }
      req.body.title = req.body.title.trim()
    }

    // Build the update — only allow the fields the frontend actually sends
    const allowedFields = ['title', 'completed', 'description', 'priority']
    const update = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field]
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new:          true,  // return the updated document
        runValidators: true, // run schema validators on the update
      }
    )

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(formatValidationError(err))
    }
    next(err)
  }
})

// DELETE /tasks/:id — delete a task
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' })
    }

    const task = await Task.findByIdAndDelete(id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
})

// ── 404 fallback (preserved from Practical 4) ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler (preserved + extended from Practical 4) ─────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json(formatValidationError(err))
  }

  res.status(500).json({ error: 'Something went wrong' })
})

// ── MongoDB connection → then start server ────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI || MONGO_URI.includes('USERNAME:PASSWORD')) {
  console.error(
    '\n[ERROR] MONGO_URI is not configured.\n' +
    '        Open server/.env and replace the placeholder with your real Atlas connection string.\n'
  )
  process.exit(1)
}

mongoose
  .connect(MONGO_URI, {
    dbName : 'awdf_tasks',
  })
  .then(() => {
    console.log('[MongoDB] Connected successfully to Atlas — database: awdf_tasks')
    app.listen(PORT, () => {
      console.log(`[Server]  Running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message)
    process.exit(1)
  })
