require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./models/Team');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const members = [
    {
      name: 'Rushit Jani',
      role: 'Section Student Representative (SSR)',
      bio: 'As the Section Student Representative for IEEE TEMS Bangalore, my vision is to foster a collaborative and innovation-driven student community that bridges technology, leadership, and management. I aim to create opportunities for meaningful engagement, industry interaction, and professional growth for every member. Together, we can build a stronger ecosystem that empowers students to lead with impact and purpose.',
      email: 'rushitjaniofficial895@ieee.com',
      linkedin: 'https://www.linkedin.com/in/rushit-jani/',
      year: 2026, order: 1
    },
    {
      name: 'Dr Madhusudhan M N',
      role: 'Secretary',
      bio: 'As the Technology and Engineering Management Society (TEMS), we don’t just anticipate the future—we actively build it. The world is evolving at a breathless pace, and your unique ideas, raw passion, and fresh perspectives are the exact catalysts the industry is waiting for. Every breakthrough in technology begins with a student who dared to look at a complex problem and say, "I can solve this." Through IEEE TEMS Bangalore, you are never charting this course alone; you have an entire global network of mentors, resources, and peers standing right behind you. Step up, embrace the challenge, and let’s transform your academic potential into global impact together.',
      email: 'msnadgir@ieee.org',
      linkedin: 'https://www.linkedin.com/in/msnadgir',
      year: 2026, order: 2
    },
    {
      name: 'Arun Shankar',
      role: 'Chair Elect',
      bio: 'I am committed to connecting the dots—bridging deep technical expertise with management vision, amplifying emerging voices, and creating spaces where innovators and practitioners thrive together. Let us together build ecosystems - not silos - where this happens.',
      email: 'arun.shankar@ieee.org',
      linkedin: 'https://www.linkedin.com/in/arunshankar-k/',
      year: 2026, order: 3
    }
  ];

  for (const m of members) {
    await Team.findOneAndUpdate(
      { name: m.name, year: m.year },
      m,
      { upsert: true, new: true }
    );
    console.log('Added/Updated:', m.name);
  }

  mongoose.disconnect();
}

run().catch(err => {
  console.error('Failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
