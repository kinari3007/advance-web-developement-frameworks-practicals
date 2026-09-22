import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:5000/tasks'

export default function TodoPage() {
  const [tasks, setTasks]               = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTaskId, setEditingTaskId]       = useState(null)
  const [editingTaskTitle, setEditingTaskTitle] = useState('')
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Unable to load tasks from the server.')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while loading tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) { setError('Please enter a task title.'); return }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to add task.')
      setTasks(prev => [...prev, data])
      setNewTaskTitle('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while adding the task.')
    }
  }

  const handleToggleTask = async (taskId, completed) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to update task.')
      setTasks(prev => prev.map(t => t.id === taskId ? data : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating the task.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to delete task.')
      setTasks(prev => prev.filter(t => t.id !== taskId))
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
    if (!editingTaskTitle.trim()) { setError('Please enter a task title.'); return }
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTaskTitle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to update task.')
      setTasks(prev => prev.map(t => t.id === taskId ? data : t))
      setEditingTaskId(null)
      setEditingTaskTitle('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while updating the task.')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'active')    return !task.completed
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
          <h2 className="section-title">To-Do <em>List</em></h2>
          <p className="repos-intro">
            Keep track of your daily tasks with a simple, live-updating list.
          </p>
        </div>

        {error && (
          <div className="error-card todo-error-card">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Add task form */}
        <form className="todo-form" onSubmit={handleAddTask}>
          <input
            type="text"
            className="repos-search"
            placeholder="Add a new task…"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            aria-label="New task title"
          />
          <button type="submit" className="retry-button">Add Task</button>
        </form>

        {/* Filters */}
        <div className="todo-filters">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              type="button"
              className={`todo-filter-button${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Tasks' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="todo-list">
          {filteredTasks.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              No {filter !== 'all' ? filter : ''} tasks yet.
            </p>
          )}
          {filteredTasks.map(task => (
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
                      onChange={e => setEditingTaskTitle(e.target.value)}
                      aria-label="Edit task title"
                    />
                  ) : (
                    <span className={`todo-title${task.completed ? ' completed' : ''}`}>
                      {task.title}
                    </span>
                  )}
                </label>
              </div>

              <div className="todo-actions">
                {editingTaskId === task.id ? (
                  <>
                    <button type="button" className="todo-save"   onClick={() => handleSaveEditing(task.id)}>Save</button>
                    <button type="button" className="todo-cancel" onClick={handleCancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="todo-edit"   onClick={() => handleStartEditing(task)}>Edit</button>
                    <button type="button" className="todo-delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
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
