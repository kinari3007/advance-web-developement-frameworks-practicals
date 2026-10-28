'use strict'

/**
 * taskEvents.js — Practical 10: Shared EventEmitter instance
 *
 * A single EventEmitter is created here and exported for use across the
 * entire server.  Using one shared instance ensures that listeners registered
 * in taskListeners.js and emits in server.js operate on the same object.
 *
 * Node.js built-in 'events' module — no external dependency required.
 */

const { EventEmitter } = require('events')

// ── Shared emitter instance ───────────────────────────────────────────────────
const taskEmitter = new EventEmitter()

// ── Event name constants ──────────────────────────────────────────────────────
// Exported as constants so both server.js (emitter) and taskListeners.js
// (listener) reference identical strings without risk of typos.
const TASK_CREATED = 'task-created'
const TASK_DELETED = 'task-deleted'

module.exports = { taskEmitter, TASK_CREATED, TASK_DELETED }
