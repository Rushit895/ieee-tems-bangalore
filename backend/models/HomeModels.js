const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Live Update Model
const LiveUpdateSchema = new Schema({
  text: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Hero Slide Model
const HeroSlideSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  buttonText: { type: String },
  buttonLink: { type: String },
  order: { type: Number, default: 0 }
});

// Counter Model
const CounterSchema = new Schema({
  label: { type: String, required: true, unique: true, trim: true },
  value: { type: Number, required: true },
  icon: { type: String }
});

// Karnataka Info Model
const KarnatakaSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }  // stores filename (upload) or full URL; supports images and videos
});

// GIF Section Model
const GifSectionSchema = new Schema({
  gifUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

// Chair Message Model
const ChairMessageSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String, required: true }
});

// Home Gallery Model
const HomeGallerySchema = new Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Home Updates Model
const HomeUpdateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Activity/Capability Model (for About page "What We Do")
const ActivitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'fas fa-check' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Membership Category Model
const MembershipCategorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Advantage Model (for Join page "Why Join")
const AdvantageSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'fas fa-star' },
  order: { type: Number, default: 0 }
});

// Join Step Model (for Join page timeline)
const JoinStepSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  order: { type: Number, default: 0 }
});

// Focus Area Model (for About page "Mission, Vision & Focus")
const FocusAreaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'fas fa-bullseye' },
  order: { type: Number, default: 0 }
});

// Social Link Model
const SocialLinkSchema = new Schema({
  platform: { type: String, required: true, unique: true, trim: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 }
});

// About Intro Model (Homepage)
const AboutIntroSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  linkText: { type: String, default: 'Learn More' },
  linkUrl: { type: String, default: 'about.html' }
});

// Contact Information Model
const ContactInfoSchema = new Schema({
  type: { type: String, required: true, enum: ['address', 'phone', 'email'] },
  value: { type: String, required: true },
  label: { type: String },
  icon: { type: String }
});

// Generic Page Content Model
const PageContentSchema = new Schema({
  page: { type: String, required: true }, // e.g., 'about', 'join'
  section: { type: String, required: true }, // e.g., 'hero', 'intro'
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  content: { type: String, trim: true },
  image: { type: String },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  order: { type: Number, default: 0 }
});

// Ensure only one record per page section
PageContentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = { 
    LiveUpdate: mongoose.model('LiveUpdate', LiveUpdateSchema),
    HeroSlide: mongoose.model('HeroSlide', HeroSlideSchema),
    Counter: mongoose.model('Counter', CounterSchema),
    Karnataka: mongoose.model('Karnataka', KarnatakaSchema),
    GifSection: mongoose.model('GifSection', GifSectionSchema),
    ChairMessage: mongoose.model('ChairMessage', ChairMessageSchema),
    HomeGallery: mongoose.model('HomeGallery', HomeGallerySchema),
    HomeUpdate: mongoose.model('HomeUpdate', HomeUpdateSchema),
    Activity: mongoose.model('Activity', ActivitySchema),
    MembershipCategory: mongoose.model('MembershipCategory', MembershipCategorySchema),
    Advantage: mongoose.model('Advantage', AdvantageSchema),
    JoinStep: mongoose.model('JoinStep', JoinStepSchema),
    FocusArea: mongoose.model('FocusArea', FocusAreaSchema),
    SocialLink: mongoose.model('SocialLink', SocialLinkSchema),
    AboutIntro: mongoose.model('AboutIntro', AboutIntroSchema),
    ContactInfo: mongoose.model('ContactInfo', ContactInfoSchema),
    PageContent: mongoose.model('PageContent', PageContentSchema)
};