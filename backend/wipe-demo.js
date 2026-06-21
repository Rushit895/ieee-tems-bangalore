require('dotenv').config();
const mongoose = require('mongoose');

const Event = require('./models/Event');
const Team = require('./models/Team');
const Blog = require('./models/Blog');
const StudentBranch = require('./models/StudentBranch');
const PastExeCom = require('./models/PastExeCom');
const Resource = require('./models/Resource');
const {
  LiveUpdate, HeroSlide, Counter, Karnataka, ChairMessage,
  HomeGallery, AboutIntro, ContactInfo, SocialLink
} = require('./models/HomeModels');

// NOTE: PageContent (page-hero CMS entries) is intentionally NOT wiped,
// since those were just configured via the admin panel.

async function wipe() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  await Promise.all([
    Event.deleteMany({}), Team.deleteMany({}), Blog.deleteMany({}),
    StudentBranch.deleteMany({}), PastExeCom.deleteMany({}), Resource.deleteMany({}),
    LiveUpdate.deleteMany({}), HeroSlide.deleteMany({}), Counter.deleteMany({}),
    Karnataka.deleteMany({}), ChairMessage.deleteMany({}), HomeGallery.deleteMany({}),
    AboutIntro.deleteMany({}), ContactInfo.deleteMany({}), SocialLink.deleteMany({})
  ]);

  console.log('Demo data wiped (PageContent/hero CMS entries preserved).');
  mongoose.disconnect();
}

wipe().catch(err => {
  console.error('Wipe failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
