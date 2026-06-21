const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, trim: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add compound unique index
ExamSchema.index({ title: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Exam', ExamSchema);