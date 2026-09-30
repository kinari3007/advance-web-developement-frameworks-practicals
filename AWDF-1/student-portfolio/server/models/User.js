const mongoose = require('mongoose')

// ── User Schema ───────────────────────────────────────────────────────────────
// Stores registered user credentials.
// ONLY the bcrypt hash of the password is stored — never the plain text.
const userSchema = new mongoose.Schema(
  {
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      trim:     true,
      lowercase: true,
    },

    password: {
      type:     String,
      required: [true, 'Password is required'],
      // No minLength enforced at schema level; handled in route before hashing
    },
  },
  { timestamps: true }
)

// ── toJSON: never expose the password hash in API responses ──────────────────
userSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.password      // ← hash is NEVER sent to the client
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)
