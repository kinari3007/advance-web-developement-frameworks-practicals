const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

let tasks = []
let nextId = 1

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`)
  next()
})

app.use(cors())
app.use(express.json())

function requireJson(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' })
    }
  }

  next()
}

app.use(requireJson)

function validateTaskId(req, res, next) {
  const taskId = Number(req.params.id)

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res.status(400).json({ error: 'Invalid task id' })
  }

  next()
}

app.get('/tasks', (req, res, next) => {
  try {
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
})

app.post('/tasks', (req, res, next) => {
  try {
    const { title } = req.body || {}

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' })
    }

    const newTask = {
      id: nextId++,
      title: title.trim(),
      completed: false
    }

    tasks.push(newTask)
    res.status(201).json(newTask)
  } catch (err) {
    next(err)
  }
})

app.put('/tasks/:id', validateTaskId, (req, res, next) => {
  try {
    const taskId = Number(req.params.id)
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...req.body,
      id: taskId
    }

    if (typeof updatedTask.title === 'string') {
      updatedTask.title = updatedTask.title.trim()
    }

    if (updatedTask.title === '') {
      return res.status(400).json({ error: 'Task title cannot be empty' })
    }

    tasks[taskIndex] = updatedTask
    res.status(200).json(updatedTask)
  } catch (err) {
    next(err)
  }
})

app.delete('/tasks/:id', validateTaskId, (req, res, next) => {
  try {
    const taskId = Number(req.params.id)
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }

    tasks.splice(taskIndex, 1)
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
