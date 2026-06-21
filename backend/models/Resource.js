const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  previewImage: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  fileType: { type: String, enum: ['PNG', 'SVG', 'JPG', 'PDF', 'OTHER'], default: 'PNG' },
  fileSize: { type: String },
  category: { type: String, enum: ['IEEE', 'TEMS', 'BANGALORE SECTION', 'AGM REPORT', 'OTHER'], default: 'IEEE' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);
