'use strict'

/**
 * taskListeners.js — Practical 10: Background event listeners
 *
 * Registers listeners on the shared taskEmitter for:
 *   task-created  — fires after a task is successfully saved to MongoDB
 *   task-deleted  — fires after a task is successfully deleted from MongoDB
 *   error         — catches deliberately emitted errors so the server never
 *                   terminates due to an unhandled EventEmitter error event
 *
 * Each data listener schedules its work inside setTimeout (500 ms) to
 * simulate asynchronous background processing.  The HTTP response is sent
 * BEFORE these timers run, so API latency is never increased.
 *
 * IMPORTANT — Node.js EventEmitter behaviour:
 * An 'error' event emitted on an EventEmitter with no registered 'error'
 * listener will throw synchronously and terminate the process.
 * The error listener below prevents that for deliberate demonstrations.
 *
 * Calling require('./taskListeners') once in server.js is sufficient to
 * register all three listeners.
 */

const { taskEmitter, TASK_CREATED, TASK_DELETED } = require('./taskEvents')

const DELAY_MS = 500   // simulated background-processing delay

// ── task-created listener ─────────────────────────────────────────────────────
taskEmitter.on(TASK_CREATED, (payload) => {
  // The listener itself returns immediately; all work is inside the timer.
  // This guarantees zero impact on the HTTP response that was already sent.
  setTimeout(() => {
    console.log(
      '[Event: task-created] Background processing completed\n' +
      `  Task ID   : ${payload.id}\n` +
      `  Title     : ${payload.title}\n` +
      `  Owner     : ${payload.owner}\n` +
      `  Priority  : ${payload.priority}\n` +
      `  Completed : ${payload.completed}\n` +
      `  Timestamp : ${payload.timestamp}`
    )
  }, DELAY_MS)
})

// ── task-deleted listener ─────────────────────────────────────────────────────
taskEmitter.on(TASK_DELETED, (payload) => {
  setTimeout(() => {
    console.log(
      '[Event: task-deleted] Background processing completed\n' +
      `  Task ID   : ${payload.id}\n` +
      `  Title     : ${payload.title}\n` +
      `  Owner     : ${payload.owner}\n` +
      `  Timestamp : ${payload.timestamp}`
    )
  }, DELAY_MS)
})

// ── error listener ────────────────────────────────────────────────────────────
// Must be registered before any event is emitted so that a deliberate
// taskEmitter.emit('error', new Error('...')) is caught here rather than
// propagating as an uncaught exception.
taskEmitter.on('error', (err) => {
  // Log the message and name only — never log secrets, tokens, or stack
  // traces that contain internal paths in production.
  console.error(
    `[Event: error] Custom error listener caught a deliberate error\n` +
    `  Name    : ${err.name}\n` +
    `  Message : ${err.message}\n` +
    `  Server continues running normally.`
  )
})

// ── Error demonstration helper ────────────────────────────────────────────────
/**
 * triggerDemoError()
 *
 * Emits a deliberate, non-fatal error on the shared emitter so you can
 * verify that the 'error' listener above catches and logs it without
 * terminating the Node.js process.
 *
 * How to invoke during development (do NOT create a permanent file):
 *
 *   node -e "require('./taskListeners').triggerDemoError()"
 *
 * Run from the server/ directory.  The error listener output will appear in
 * the console and the process will exit cleanly (no crash, no stack dump).
 *
 * While the server is running you can call this from a second terminal
 * in the server/ directory.  The running server process is NOT affected
 * because this helper targets the shared emitter only when imported.
 * To trigger it inside the running server, import and call it once from
 * a temporary addition to server.js, observe the output, then remove it.
 */
function triggerDemoError() {
  console.log('[Demo] Emitting deliberate error event on taskEmitter…')
  taskEmitter.emit('error', new Error('Practical 10 — deliberate demo error'))
}

module.exports = { triggerDemoError }
