const mongoose = require('mongoose');

const StudentBranchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  institutionImage: { type: String },
  city: { type: String, required: true },
  formationDate: { type: Date },
  memberCount: { type: Number, default: 0 },
  description: { type: String },
  website: { type: String },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  },
  advisor: {
    name: { type: String },
    photo: { type: String },
    linkedin: { type: String }
  },
  chair: {
    name: { type: String },
    photo: { type: String },
    linkedin: { type: String }
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentBranch', StudentBranchSchema);
