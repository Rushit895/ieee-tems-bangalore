require('dotenv').config();
const mongoose = require('mongoose');
const StudentBranch = require('./models/StudentBranch');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const branches = [
    {
      name: 'IEEE TEMS REVA University',
      city: 'Bengaluru, Karnataka',
      description: 'Technology and Engineering Management Society (TEMS) Affinity Group at REVA University, focused on leadership, innovation, technology management, entrepreneurship, and professional development activities for students.',
      formationDate: new Date('2020-01-01'),
      memberCount: 11,
      website: '',
      socialLinks: { linkedin: 'https://www.linkedin.com/company/ieee-tems-reva', instagram: 'https://www.instagram.com/ieeetems_reva' },
      advisor: { name: 'Dr. M. Devanathan' },
      chair: { name: 'Rushit Jani' },
      latitude: 13.1140, longitude: 77.6024, order: 1
    },
    {
      name: 'PA College of Engineering IEEE Student Branch',
      city: 'Mangaluru, Karnataka',
      description: 'IEEE Student Branch at PA College of Engineering dedicated to technical learning, professional networking, workshops, competitions, and industry engagement for engineering students.',
      formationDate: new Date('2024-01-01'),
      memberCount: 3,
      website: 'https://paceieee.org/',
      socialLinks: { linkedin: 'https://www.linkedin.com/company/ieee-sb-pace/', instagram: 'https://www.instagram.com/ieee_pace' },
      advisor: { name: 'Dr. Ramis MK' },
      chair: { name: 'Mohammed Zaid' },
      latitude: 12.8696, longitude: 74.8839, order: 2
    },
    {
      name: 'IEEE NMIT TEMS Affinity Group',
      city: 'Bengaluru, Karnataka',
      description: 'Technology and Engineering Management Society (TEMS) Affinity Group under IEEE NMIT Student Branch, promoting innovation management, entrepreneurship, leadership development, and industry-oriented learning.',
      formationDate: new Date('2026-01-01'),
      memberCount: 12,
      website: '',
      socialLinks: { linkedin: 'https://www.linkedin.com/company/ieee-nmit-sb/', instagram: 'https://www.instagram.com/ieee.nmit' },
      advisor: { name: 'Archana Naik' },
      chair: { name: 'Tharun P' },
      latitude: 13.0707, longitude: 77.5934, order: 3
    }
  ];

  for (const b of branches) {
    await StudentBranch.findOneAndUpdate(
      { name: b.name },
      b,
      { upsert: true, new: true }
    );
    console.log('Added/Updated:', b.name);
  }

  mongoose.disconnect();
}

run().catch(err => {
  console.error('Failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
