const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  photo: { type: String, default: 'default-avatar.png' },
  bio: { type: String, trim: true },
  email: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  year: { type: Number, default: new Date().getFullYear() },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Add compound unique index to prevent duplicate members in the same year
TeamSchema.index({ name: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Team', TeamSchema);