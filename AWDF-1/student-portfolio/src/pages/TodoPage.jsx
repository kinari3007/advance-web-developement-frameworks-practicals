import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000/tasks'

export default function TodoPage() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to load tasks from the server.')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while loading tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (event) => {
    event.preventDefault()

    if (!newTaskTitle.trim()) {
      setError('Please enter a task title.')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to add task.')
      }

      setTasks((prevTasks) => [...prevTasks, data])
      setNewTaskTitle('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while adding the task.')
    }
  }

  const handleToggleTask = async (taskId, completed) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to update task.')
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data : task))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating the task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete task.')
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while deleting the task.')
    }
  }

  const handleStartEditing = (task) => {
    setEditingTaskId(task.id)
    setEditingTaskTitle(task.title)
    setError(null)
  }

  const handleCancelEditing = () => {
    setEditingTaskId(null)
    setEditingTaskTitle('')
    setError(null)
  }

  const handleSaveEditing = async (taskId) => {
    if (!editingTaskTitle.trim()) {
      setError('Please enter a task title.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTaskTitle })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to update task.')
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? data : task))
      )
      setEditingTaskId(null)
      setEditingTaskTitle('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating the task.')
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  })

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="spinner-wrapper" role="status" aria-live="polite">
            <div className="spinner" aria-label="Loading tasks" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Task Manager</span>
          <h2 className="section-title">To-Do List</h2>
          <p className="repos-intro">
            Keep track of your daily tasks with a simple, live-updating list.
          </p>
        </div>

        {error && (
          <div className="error-card todo-error-card">
            <p className="error-message">{error}</p>
          </div>
        )}

        <form className="todo-form" onSubmit={handleAddTask}>
          <input
            type="text"
            className="repos-search"
            placeholder="Add a new task"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            aria-label="New task title"
          />
          <button type="submit" className="retry-button">
            Add Task
          </button>
        </form>

        <div className="todo-filters">
          <button
            type="button"
            className={`todo-filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            type="button"
            className={`todo-filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={`todo-filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {filteredTasks.map((task) => (
            <article key={task.id} className="repo-card todo-card">
              <div className="todo-card-main">
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id, !task.completed)}
                  />
                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editingTaskTitle}
                      onChange={(event) => setEditingTaskTitle(event.target.value)}
                      aria-label="Edit task title"
                    />
                  ) : (
                    <span className={task.completed ? 'todo-title completed' : 'todo-title'}>
                      {task.title}
                    </span>
                  )}
                </label>
              </div>

              <div className="todo-actions">
                {editingTaskId === task.id ? (
                  <>
                    <button type="button" className="todo-save" onClick={() => handleSaveEditing(task.id)}>
                      Save
                    </button>
                    <button type="button" className="todo-cancel" onClick={handleCancelEditing}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="todo-edit" onClick={() => handleStartEditing(task)}>
                      Edit
                    </button>
                    <button type="button" className="todo-delete" onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
