const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  organizer: { type: String },
  registerLink: { type: String },
  moreInfoLink: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);