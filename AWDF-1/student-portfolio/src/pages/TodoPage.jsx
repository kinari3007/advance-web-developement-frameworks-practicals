import { useEffect, useReducer, useState, useRef, useCallback } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../api'

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITIES = [
  { value: 'high',   label: 'High'   },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low'    },
]

/** Visual style config for each priority level */
const PRIORITY_STYLE = {
  high:   { color: '#ff6b6b', border: 'rgba(255,107,107,0.35)', bg: 'rgba(255,107,107,0.1)'  },
  medium: { color: '#4DB8FF', border: 'rgba(77,184,255,0.35)',  bg: 'rgba(77,184,255,0.08)'  },
  low:    { color: '#6ee7b7', border: 'rgba(110,231,183,0.35)', bg: 'rgba(110,231,183,0.08)' },
}

/** Small pill badge shown on each task card */
function PriorityBadge({ priority }) {
  const s = PRIORITY_STYLE[priority] || PRIORITY_STYLE.medium
  return (
    <span style={{
      display:       'inline-block',
      padding:       '3px 9px',
      borderRadius:  '999px',
      fontSize:      '9px',
      fontFamily:    'var(--font-heading)',
      fontWeight:    600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         s.color,
      border:        `1px solid ${s.border}`,
      background:    s.bg,
      flexShrink:    0,
    }}>
      {priority ? priority.toUpperCase() : 'MEDIUM'}
    </span>
  )
}

/** Reusable <select> styled to match the existing design */
function PrioritySelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Priority"
      style={{
        padding:       '14px 18px',
        border:        '1px solid var(--border)',
        borderRadius:  '12px',
        background:    'rgba(3,11,24,0.6)',
        color:         value ? PRIORITY_STYLE[value]?.color : 'var(--text-primary)',
        fontFamily:    'var(--font-heading)',
        fontSize:      '13px',
        letterSpacing: '0.08em',
        outline:       'none',
        cursor:        disabled ? 'not-allowed' : 'pointer',
        transition:    'border-color 0.3s',
        width:         '100%',
        maxWidth:      '200px',
      }}
    >
      {PRIORITIES.map(p => (
        <option key={p.value} value={p.value}>{p.label}</option>
      ))}
    </select>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────

function useToast() {
  const [toasts, dispatch] = useReducer((state, action) => {
    if (action.type === 'ADD')    return [...state, action.toast]
    if (action.type === 'REMOVE') return state.filter(t => t.id !== action.id)
    return state
  }, [])

  const timers = useRef({})

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    dispatch({ type: 'ADD', toast: { id, message, type } })
    timers.current[id] = setTimeout(() => {
      dispatch({ type: 'REMOVE', id })
      delete timers.current[id]
    }, 3500)
  }, [])

  useEffect(() => {
    const t = timers.current
    return () => Object.values(t).forEach(clearTimeout)
  }, [])

  return { toasts, addToast }
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div style={{
      position:      'fixed',
      bottom:        '28px',
      right:         '28px',
      zIndex:        1000,
      display:       'flex',
      flexDirection: 'column',
      gap:           '10px',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:        '13px 20px',
          borderRadius:   '12px',
          fontSize:       '13px',
          fontFamily:     'var(--font-heading)',
          letterSpacing:  '0.04em',
          color:          '#f5f8ff',
          background:     t.type === 'success'
            ? 'linear-gradient(135deg,rgba(18,61,120,0.95),rgba(36,123,209,0.9))'
            : 'linear-gradient(135deg,rgba(120,30,30,0.95),rgba(200,60,60,0.88))',
          border:         `1px solid ${t.type === 'success'
            ? 'rgba(77,184,255,0.4)' : 'rgba(255,100,100,0.4)'}`,
          boxShadow:      '0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          animation:      'toast-in 0.3s cubic-bezier(0.16,1,0.3,1)',
          maxWidth:       '340px',
          pointerEvents:  'none',
        }}>
          {t.type === 'success' ? '✓ ' : '✕ '}{t.message}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION DIALOG
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmDialog({ task, onConfirm, onCancel, isDeleting }) {
  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      zIndex:         500,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'rgba(2,6,17,0.78)',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background:   'linear-gradient(135deg,rgba(6,21,43,0.97),rgba(3,11,24,0.99))',
        border:       '1px solid rgba(77,184,255,0.22)',
        borderRadius: '20px',
        padding:      '36px 40px',
        maxWidth:     '420px',
        width:        'calc(100% - 48px)',
        boxShadow:    '0 32px 80px rgba(0,0,0,0.6)',
        textAlign:    'center',
      }}>
        <p style={{
          fontSize:      '9px',
          fontFamily:    'var(--font-heading)',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color:         'var(--blue-glow)',
          marginBottom:  '14px',
        }}>
          Confirm Deletion
        </p>
        <p style={{
          fontSize:      '17px',
          fontFamily:    'var(--font-heading)',
          color:         'var(--text-primary)',
          fontWeight:    600,
          marginBottom:  '10px',
          letterSpacing: '-0.01em',
        }}>
          Delete this task?
        </p>
        <p style={{
          fontSize:     '13px',
          color:        'var(--text-muted)',
          marginBottom: '28px',
          lineHeight:   1.6,
        }}>
          &ldquo;{task.title}&rdquo; will be permanently removed.
          This cannot be undone.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
            disabled={isDeleting}
            style={{ minWidth:'110px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="retry-button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              minWidth:    '110px',
              background:  'linear-gradient(135deg,#7c1f1f,#b53030)',
              borderColor: 'rgba(255,100,100,0.3)',
              opacity:     isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TASKS REDUCER
// ─────────────────────────────────────────────────────────────────────────────

function tasksReducer(state, action) {
  switch (action.type) {
    case 'SET':         return action.tasks
    case 'ADD':         return [...state, action.task]
    case 'REPLACE_TMP': return state.map(t => t._tmp ? action.task : t)
    case 'REMOVE_TMP':  return state.filter(t => !t._tmp)
    case 'UPDATE':      return state.map(t => t.id === action.task.id ? action.task : t)
    case 'DELETE':      return state.filter(t => t.id !== action.id)
    default:            return state
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function TodoPage() {
  // ── tasks ──────────────────────────────────────────────────────────────────
  const [tasks,   dispatch]     = useReducer(tasksReducer, [])

  // ── add-form ───────────────────────────────────────────────────────────────
  const [formTitle,    setFormTitle]    = useState('')
  const [formDesc,     setFormDesc]     = useState('')
  const [formPriority, setFormPriority] = useState('medium')   // ← new

  // ── edit ───────────────────────────────────────────────────────────────────
  const [editId,       setEditId]       = useState(null)
  const [editTitle,    setEditTitle]    = useState('')
  const [editDesc,     setEditDesc]     = useState('')
  const [editPriority, setEditPriority] = useState('medium')   // ← new

  // ── filters ────────────────────────────────────────────────────────────────
  const [filterStatus,   setFilterStatus]   = useState('all')   // all | active | completed
  const [filterPriority, setFilterPriority] = useState('all')   // all | high | medium | low  ← new

  // ── loading flags ──────────────────────────────────────────────────────────
  const [loadingInit, setLoadingInit] = useState(true)
  const [loadingAdd,  setLoadingAdd]  = useState(false)
  const [savingId,    setSavingId]    = useState(null)
  const [togglingId,  setTogglingId]  = useState(null)
  const [deletingId,  setDeletingId]  = useState(null)

  // ── confirm dialog ─────────────────────────────────────────────────────────
  const [confirmTask, setConfirmTask] = useState(null)

  // ── page-level error ───────────────────────────────────────────────────────
  const [pageError, setPageError] = useState(null)

  // ── toasts ─────────────────────────────────────────────────────────────────
  const { toasts, addToast } = useToast()

  // ── LOAD tasks ─────────────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoadingInit(true)
    setPageError(null)
    try {
      const data = await getTasks()
      dispatch({ type: 'SET', tasks: data })
    } catch (err) {
      setPageError(err.message)
      addToast(err.message, 'error')
    } finally {
      setLoadingInit(false)
    }
  }, [addToast])

  useEffect(() => { loadTasks() }, [loadTasks])

  // ── CREATE (optimistic) ────────────────────────────────────────────────────
  const handleAddTask = async (e) => {
    e.preventDefault()
    const title    = formTitle.trim()
    const desc     = formDesc.trim()
    const priority = formPriority          // already lowercase: 'high'|'medium'|'low'

    if (!title) {
      addToast('Please enter a task title.', 'error')
      return
    }

    // 1. Optimistic placeholder
    const tmpTask = { _tmp: true, id: '__tmp__', title, description: desc, completed: false, priority }
    dispatch({ type: 'ADD', task: tmpTask })
    setFormTitle('')
    setFormDesc('')
    setFormPriority('medium')              // reset dropdown to default
    setLoadingAdd(true)

    try {
      // 2. Real POST — sends title, description, AND priority to backend
      const created = await createTask({ title, description: desc, priority })
      // 3. Swap placeholder → real MongoDB document
      dispatch({ type: 'REPLACE_TMP', task: created })
      addToast('Task created successfully.', 'success')
    } catch (err) {
      // 4. Failed — remove placeholder, restore form
      dispatch({ type: 'REMOVE_TMP' })
      setFormTitle(title)
      setFormDesc(desc)
      setFormPriority(priority)
      addToast(err.message, 'error')
    } finally {
      setLoadingAdd(false)
    }
  }

  // ── TOGGLE completed ────────────────────────────────────────────────────────
  const handleToggle = async (task) => {
    if (togglingId === task.id) return
    setTogglingId(task.id)
    dispatch({ type: 'UPDATE', task: { ...task, completed: !task.completed } })
    try {
      const updated = await updateTask(task.id, { completed: !task.completed })
      dispatch({ type: 'UPDATE', task: updated })
      addToast(updated.completed ? 'Task marked complete.' : 'Task marked active.', 'success')
    } catch (err) {
      dispatch({ type: 'UPDATE', task })    // rollback
      addToast(err.message, 'error')
    } finally {
      setTogglingId(null)
    }
  }

  // ── START / CANCEL edit ────────────────────────────────────────────────────
  const handleStartEdit = (task) => {
    setEditId(task.id)
    setEditTitle(task.title)
    setEditDesc(task.description || '')
    setEditPriority(task.priority || 'medium')   // ← pre-fill priority
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setEditTitle('')
    setEditDesc('')
    setEditPriority('medium')
  }

  // ── SAVE edit ──────────────────────────────────────────────────────────────
  const handleSaveEdit = async (taskId) => {
    const title = editTitle.trim()
    if (!title) {
      addToast('Task title cannot be empty.', 'error')
      return
    }
    setSavingId(taskId)
    try {
      // Sends title, description, AND priority — backend persists all three
      const updated = await updateTask(taskId, {
        title,
        description: editDesc.trim(),
        priority:    editPriority,          // ← included in PUT body
      })
      dispatch({ type: 'UPDATE', task: updated })
      setEditId(null)
      setEditTitle('')
      setEditDesc('')
      setEditPriority('medium')
      addToast('Task updated successfully.', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSavingId(null)
    }
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const handleDeleteRequest = (task)   => setConfirmTask(task)
  const handleDeleteCancel  = ()       => { if (!deletingId) setConfirmTask(null) }

  const handleDeleteConfirm = async () => {
    const task = confirmTask
    setDeletingId(task.id)
    try {
      await deleteTask(task.id)
      dispatch({ type: 'DELETE', id: task.id })
      setConfirmTask(null)
      addToast('Task deleted.', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // ── FILTERED LIST ──────────────────────────────────────────────────────────
  const filtered = tasks.filter(t => {
    // Status filter
    if (filterStatus === 'completed' && !t.completed)  return false
    if (filterStatus === 'active'    &&  t.completed)  return false
    // Priority filter — uses value returned from MongoDB
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    return true
  })

  // ── RENDER: initial load ───────────────────────────────────────────────────
  if (loadingInit) {
    return (
      <section className="section">
        <div className="container">
          <div className="spinner-wrapper" role="status" aria-live="polite">
            <div className="spinner" aria-label="Loading tasks…" />
          </div>
          <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'13px', marginTop:'16px' }}>
            Connecting to MongoDB…
          </p>
        </div>
        <ToastContainer toasts={toasts} />
      </section>
    )
  }

  // ── RENDER: GET failed entirely ────────────────────────────────────────────
  if (pageError && tasks.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="error-card" style={{ textAlign:'center' }}>
            <p className="error-title">Unable to load tasks</p>
            <p className="error-message">{pageError}</p>
            <button type="button" className="retry-button" onClick={loadTasks} style={{ marginTop:'8px' }}>
              Retry
            </button>
          </div>
        </div>
        <ToastContainer toasts={toasts} />
      </section>
    )
  }

  // ── RENDER: main ──────────────────────────────────────────────────────────
  return (
    <>
      {confirmTask && (
        <ConfirmDialog
          task={confirmTask}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deletingId === confirmTask.id}
        />
      )}

      <section className="section">
        <div className="container">

          {/* Header */}
          <div className="section-header">
            <span className="section-label">Task Manager</span>
            <h2 className="section-title">To-Do <em>List</em></h2>
            <p className="repos-intro">
              Full-stack task management — data persisted in MongoDB Atlas.
            </p>
          </div>

          {/* Non-fatal GET error banner */}
          {pageError && tasks.length > 0 && (
            <div className="error-card todo-error-card" style={{ marginBottom:'24px' }}>
              <p className="error-message">{pageError}</p>
            </div>
          )}

          {/* ── ADD TASK FORM ────────────────────────────────── */}
          <form
            className="todo-form"
            onSubmit={handleAddTask}
            style={{ flexDirection:'column', alignItems:'stretch', maxWidth:'640px' }}
          >
            <input
              type="text"
              className="repos-search"
              style={{ maxWidth:'100%' }}
              placeholder="Task title…"
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              disabled={loadingAdd}
              aria-label="New task title"
            />
            <textarea
              className="repos-search"
              style={{ maxWidth:'100%', resize:'vertical', minHeight:'80px', lineHeight:'1.6' }}
              placeholder="Description (optional)…"
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              disabled={loadingAdd}
              aria-label="New task description"
            />

            {/* Priority selector — new */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              <label style={{
                fontSize:'9px', fontFamily:'var(--font-heading)',
                letterSpacing:'0.18em', textTransform:'uppercase',
                color:'var(--text-muted)', whiteSpace:'nowrap',
              }}>
                Priority
              </label>
              <PrioritySelect
                value={formPriority}
                onChange={setFormPriority}
                disabled={loadingAdd}
              />
            </div>

            <button
              type="submit"
              className="retry-button"
              disabled={loadingAdd}
              style={{ alignSelf:'flex-start', opacity: loadingAdd ? 0.7 : 1 }}
            >
              {loadingAdd ? 'Adding…' : 'Add Task'}
            </button>
          </form>

          {/* ── STATUS FILTER ────────────────────────────────── */}
          <div style={{ marginBottom:'8px' }}>
            <p style={{
              fontSize:'9px', fontFamily:'var(--font-heading)',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--text-muted)', marginBottom:'8px',
            }}>
              Status
            </p>
            <div className="todo-filters">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`todo-filter-button${filterStatus === f ? ' active' : ''}`}
                  onClick={() => setFilterStatus(f)}
                >
                  {f === 'all' ? 'All Tasks' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── PRIORITY FILTER — new ─────────────────────────── */}
          <div style={{ marginBottom:'32px' }}>
            <p style={{
              fontSize:'9px', fontFamily:'var(--font-heading)',
              letterSpacing:'0.18em', textTransform:'uppercase',
              color:'var(--text-muted)', marginBottom:'8px',
            }}>
              Priority
            </p>
            <div className="todo-filters">
              {[
                { value: 'all',    label: 'All' },
                { value: 'high',   label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low',    label: 'Low' },
              ].map(f => (
                <button
                  key={f.value}
                  type="button"
                  className={`todo-filter-button${filterPriority === f.value ? ' active' : ''}`}
                  onClick={() => setFilterPriority(f.value)}
                  style={filterPriority === f.value && f.value !== 'all'
                    ? { color: PRIORITY_STYLE[f.value]?.color, borderColor: PRIORITY_STYLE[f.value]?.border }
                    : {}
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TASK LIST ────────────────────────────────────── */}
          <div className="todo-list">
            {filtered.length === 0 && (
              <p style={{ color:'var(--text-muted)', fontSize:'15px' }}>
                No {filterStatus !== 'all' ? filterStatus : ''} {filterPriority !== 'all' ? filterPriority + '-priority' : ''} tasks yet.
              </p>
            )}

            {filtered.map(task => {
              const isSaving   = savingId   === task.id
              const isToggling = togglingId === task.id
              const isDeleting = deletingId === task.id
              const isEditing  = editId     === task.id
              const isBusy     = isSaving || isToggling || isDeleting

              return (
                <article
                  key={task.id}
                  className="repo-card todo-card"
                  style={{
                    opacity:    task._tmp ? 0.6 : 1,
                    transition: 'opacity 0.3s',
                    // Subtle left border accent based on priority
                    borderLeft: `3px solid ${PRIORITY_STYLE[task.priority]?.border || PRIORITY_STYLE.medium.border}`,
                  }}
                >
                  <div className="todo-card-main">

                    {isEditing ? (
                      /* ── EDIT MODE ──────────────────────── */
                      <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'100%' }}>
                        <input
                          type="text"
                          className="todo-edit-input"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          disabled={isSaving}
                          aria-label="Edit task title"
                        />
                        <textarea
                          className="todo-edit-input"
                          style={{ resize:'vertical', minHeight:'64px', lineHeight:'1.6' }}
                          placeholder="Description (optional)…"
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                          disabled={isSaving}
                          aria-label="Edit task description"
                        />
                        {/* Priority edit — new */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <span style={{
                            fontSize:'9px', fontFamily:'var(--font-heading)',
                            letterSpacing:'0.18em', textTransform:'uppercase',
                            color:'var(--text-muted)', whiteSpace:'nowrap',
                          }}>
                            Priority
                          </span>
                          <PrioritySelect
                            value={editPriority}
                            onChange={setEditPriority}
                            disabled={isSaving}
                          />
                        </div>
                        {isSaving && (
                          <p style={{ fontSize:'11px', color:'var(--blue-glow)', fontFamily:'var(--font-heading)', letterSpacing:'0.1em' }}>
                            Saving…
                          </p>
                        )}
                      </div>
                    ) : (
                      /* ── VIEW MODE ──────────────────────── */
                      <label className="todo-check" style={{ opacity: isToggling ? 0.6 : 1, alignItems:'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggle(task)}
                          disabled={isBusy || !!task._tmp}
                          style={{ marginTop:'3px' }}
                        />
                        <div style={{ minWidth:0, flex:1 }}>
                          {/* Title row with priority badge */}
                          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                            <span className={`todo-title${task.completed ? ' completed' : ''}`}>
                              {task.title}
                              {task._tmp && (
                                <span style={{ fontSize:'10px', color:'var(--text-muted)', marginLeft:'8px' }}>
                                  (saving…)
                                </span>
                              )}
                            </span>
                            {/* Priority badge — comes from MongoDB via API response */}
                            <PriorityBadge priority={task.priority} />
                          </div>
                          {/* Description */}
                          {task.description && task.description.trim() !== '' && (
                            <p style={{
                              fontSize:'12px', color:'var(--text-muted)',
                              marginTop:'4px', lineHeight:1.5,
                              whiteSpace:'pre-wrap', wordBreak:'break-word',
                            }}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </label>
                    )}

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="todo-actions">
                    {isEditing ? (
                      <>
                        <button type="button" className="todo-save"   onClick={() => handleSaveEdit(task.id)} disabled={isSaving}>
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className="todo-cancel" onClick={handleCancelEdit} disabled={isSaving}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="todo-edit"   onClick={() => handleStartEdit(task)} disabled={isBusy || !!task._tmp}>
                          Edit
                        </button>
                        <button type="button" className="todo-delete" onClick={() => handleDeleteRequest(task)} disabled={isBusy || !!task._tmp}>
                          {isDeleting ? 'Deleting…' : 'Delete'}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

        </div>
      </section>

      <ToastContainer toasts={toasts} />

      <style>{`
        @keyframes toast-in {
          from { opacity:0; transform:translateY(14px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
      `}</style>
    </>
  )
}
