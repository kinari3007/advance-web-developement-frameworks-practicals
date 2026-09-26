const mongoose = require('mongoose')

// ── Mongoose Task Schema ──────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },

    description: {
      type: String,
      default: '',
    },

    completed: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Practical 5 supplementary: priority field
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
  },
  {
    // Do not add Mongoose's own createdAt/updatedAt — we manage createdAt ourselves
    timestamps: false,
  }
)

// ── Practical 5 supplementary: pre-save hook to trim title whitespace ─────────
taskSchema.pre('save', function () {
  if (typeof this.title === 'string') {
    this.title = this.title.trim()
  }
})

// ── toJSON transform: map _id → id so the frontend keeps working ──────────────
// The existing TodoPage.jsx uses task.id everywhere (handleToggleTask, handleDeleteTask,
// handleStartEditing, handleSaveEditing). MongoDB stores _id (ObjectId). This transform
// adds a virtual `id` string field and removes the raw `_id` and `__v` from responses.
taskSchema.set('toJSON', {
  virtuals: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Task', taskSchema)
