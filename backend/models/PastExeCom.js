const mongoose = require('mongoose');

const PastExeComSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  role:     { type: String, required: true, trim: true },
  year:     { type: Number, required: true },
  photo:    { type: String, default: '' },
  linkedin: { type: String, default: '' },
  order:    { type: Number, default: 0 },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('PastExeCom', PastExeComSchema);
