require('dotenv').config();
const mongoose = require('mongoose');
const PastExeCom = require('./models/PastExeCom');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const members = [
    { name: 'Yatheendranath TJ',   role: 'Chair', year: 2025, order: 1 },
    { name: 'Pushpamala',          role: 'Chair', year: 2024, order: 1 },
    { name: 'Dr. G.S. Javed',      role: 'Chair', year: 2023, order: 1 },
    { name: 'Dr Ashawini Appaji',  role: 'Chair', year: 2022, order: 1 },
    { name: 'Dr. Y.V.S. Lakshmi',  role: 'Chair', year: 2020, order: 1 }
  ];

  for (const m of members) {
    await PastExeCom.findOneAndUpdate(
      { name: m.name, year: m.year },
      m,
      { upsert: true, new: true }
    );
    console.log('Added/Updated:', m.year, '-', m.name);
  }

  mongoose.disconnect();
}

run().catch(err => {
  console.error('Failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
