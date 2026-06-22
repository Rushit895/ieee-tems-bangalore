require('dotenv').config();
const mongoose = require('mongoose');
const { PageContent } = require('./models/HomeModels');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  await PageContent.findOneAndUpdate(
    { page: 'gallery', section: 'hero' },
    {
      page: 'gallery', section: 'hero',
      title: 'Our <span>Gallery</span>',
      subtitle: 'Visual Journey',
      content: 'Capturing moments of innovation, leadership, and community excellence at IEEE TEMS Bangalore.',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    { upsert: true, new: true }
  );
  console.log('Gallery hero entry created/updated.');
  mongoose.disconnect();
}

run().catch(err => { console.error('Failed:', err.message); mongoose.disconnect(); process.exit(1); });
