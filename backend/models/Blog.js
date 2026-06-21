const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  content: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, default: 'Announcement' },
  date: { type: Date, default: Date.now },
  image: { type: String },
  articleUrl: { type: String, trim: true }
});

module.exports = mongoose.model('Blog', BlogSchema);