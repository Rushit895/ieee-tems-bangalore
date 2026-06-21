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
  HomeGallery, AboutIntro, ContactInfo, SocialLink, PageContent
} = require('./models/HomeModels');

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB Atlas');

  // Clear all collections
  await Promise.all([
    Event.deleteMany({}), Team.deleteMany({}), Blog.deleteMany({}),
    StudentBranch.deleteMany({}), PastExeCom.deleteMany({}), Resource.deleteMany({}),
    LiveUpdate.deleteMany({}), HeroSlide.deleteMany({}), Counter.deleteMany({}),
    Karnataka.deleteMany({}), ChairMessage.deleteMany({}), HomeGallery.deleteMany({}),
    AboutIntro.deleteMany({}), ContactInfo.deleteMany({}), SocialLink.deleteMany({}),
    PageContent.deleteMany({})
  ]);
  console.log('🗑️  Cleared all collections');

  // ─── LIVE UPDATES (Ticker) ───────────────────────────────────────────────
  await LiveUpdate.insertMany([
    { text: 'Registration open for TEMSCON 2026 — Bangalore', active: true },
    { text: 'New Student Branch established at REVA University', active: true },
    { text: 'IEEE TEMS Bangalore Annual General Meeting — July 2026', active: true },
    { text: 'Resources updated: Latest management frameworks now available', active: true },
  ]);

  // ─── HERO SLIDES ────────────────────────────────────────────────────────
  await HeroSlide.insertMany([
    {
      title: 'Engineering Future <br>Strategic Leaders',
      subtitle: 'Leadership • Innovation • Excellence',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000',
      buttonText: 'Become a Member',
      buttonLink: 'join-ieee.html',
      order: 1
    },
    {
      title: 'Driving Innovation <br>Across Karnataka',
      subtitle: 'IEEE TEMS Bangalore Section',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2000',
      buttonText: 'Explore Events',
      buttonLink: 'events.html',
      order: 2
    },
    {
      title: 'Connect. Lead. <br>Transform.',
      subtitle: 'Technology & Engineering Management',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000',
      buttonText: 'Meet Our Team',
      buttonLink: 'execom.html',
      order: 3
    }
  ]);

  // ─── COUNTERS / STATS ────────────────────────────────────────────────────
  await Counter.insertMany([
    { label: 'Active Members', value: 1200 },
    { label: 'Events Conducted', value: 85 },
    { label: 'Student Branches', value: 12 },
    { label: 'Years of Impact', value: 15 },
  ]);

  // ─── ABOUT INTRO ─────────────────────────────────────────────────────────
  await AboutIntro.create({
    title: 'About IEEE TEMS',
    content: 'The Technology and Engineering Management Society (TEMS) is dedicated to advancing management and leadership skills. The Bangalore Section connects professionals across India\'s silicon valley hub, providing a platform for growth, networking, and excellence.',
    linkText: 'Learn More',
    linkUrl: 'about.html'
  });

  // ─── KARNATAKA PRESENCE ──────────────────────────────────────────────────
  await Karnataka.create({
    title: 'Empowering Innovation in Karnataka',
    content: 'From global R&D centers to thriving startups, Bangalore is the heart of India\'s technology revolution. IEEE TEMS Bangalore connects this ecosystem with the people, ideas, and leadership shaping its future.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200'
  });

  // ─── CHAIR MESSAGE ───────────────────────────────────────────────────────
  await ChairMessage.create({
    name: 'Dr. Rajesh Kumar',
    designation: 'Chair, IEEE TEMS Bangalore Section',
    message: 'IEEE TEMS Bangalore has been at the forefront of bridging technology and management excellence. Our mission is to empower engineers and technologists with the leadership skills needed to navigate a rapidly evolving world. Together, we are shaping the future of technology management in India.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
  });

  // ─── HOME GALLERY ─────────────────────────────────────────────────────────
  await HomeGallery.insertMany([
    { imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', caption: 'Annual Tech Summit 2025' },
    { imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', caption: 'Leadership Workshop' },
    { imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', caption: 'Student Branch Meetup' },
    { imageUrl: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?w=600&q=80', caption: 'Innovation Challenge 2025' },
    { imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80', caption: 'IEEE TEMS AGM 2025' },
    { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80', caption: 'Networking Event' },
  ]);

  // ─── CONTACT INFO ─────────────────────────────────────────────────────────
  await ContactInfo.insertMany([
    { type: 'email', value: 'bangalore@ieee-tems.org', label: 'General Enquiries', icon: 'fas fa-envelope' },
    { type: 'address', value: 'Bangalore, Karnataka, India', label: 'Location', icon: 'fas fa-map-marker-alt' },
  ]);

  // ─── SOCIAL LINKS ─────────────────────────────────────────────────────────
  await SocialLink.insertMany([
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/ieee-tems-bangalore', icon: 'fab fa-linkedin', order: 1 },
    { platform: 'Instagram', url: 'https://www.instagram.com/ieee_tems_bangalore', icon: 'fab fa-instagram', order: 2 },
    { platform: 'YouTube', url: 'https://www.youtube.com/@IEEETEMSBangalore', icon: 'fab fa-youtube', order: 3 },
  ]);

  // ─── EVENTS ───────────────────────────────────────────────────────────────
  await Event.insertMany([
    {
      title: 'TEMSCON 2026 — Innovation & Leadership Summit',
      description: 'Join us for the flagship annual conference bringing together technology leaders, entrepreneurs, and IEEE members from across India. Featuring keynotes, panel discussions, and hands-on workshops on emerging trends in tech management.',
      date: new Date('2026-08-15'),
      endDate: new Date('2026-08-16'),
      location: 'IISc Bangalore, Auditorium',
      category: 'Conferences',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      registrationLink: 'https://events.vtools.ieee.org',
      isFeatured: true,
      status: 'upcoming'
    },
    {
      title: 'Workshop: Design Thinking for Engineers',
      description: 'A hands-on full-day workshop exploring how design thinking principles can transform engineering problem-solving. Participants will work through real-world challenges using structured frameworks.',
      date: new Date('2026-07-20'),
      location: 'REVA University, Bangalore',
      category: 'Workshops',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      registrationLink: 'https://events.vtools.ieee.org',
      isFeatured: false,
      status: 'upcoming'
    },
    {
      title: 'Expert Talk: AI & the Future of Engineering Management',
      description: 'An insightful session with industry veterans on how artificial intelligence is reshaping engineering management practices, project delivery, and decision-making in global organisations.',
      date: new Date('2026-07-05'),
      location: 'Online (Zoom)',
      category: 'Talks',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      registrationLink: 'https://events.vtools.ieee.org',
      isFeatured: false,
      status: 'upcoming'
    },
    {
      title: 'Student Innovation Challenge 2025',
      description: 'Inter-college competition for student teams to present innovative technology management solutions. Winners received grants and mentorship opportunities from industry leaders.',
      date: new Date('2025-11-18'),
      location: 'PES University, Bangalore',
      category: 'Competitions',
      image: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?w=800&q=80',
      registrationLink: '#',
      isFeatured: false,
      status: 'past'
    },
    {
      title: 'Annual General Meeting — IEEE TEMS Bangalore 2025',
      description: 'The annual gathering of IEEE TEMS Bangalore Section members to review the year\'s activities, elect new committee members, and plan for the upcoming year.',
      date: new Date('2025-09-25'),
      location: 'Taj Vivanta, Bangalore',
      category: 'AGM',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
      registrationLink: '#',
      isFeatured: false,
      status: 'past'
    }
  ]);

  // ─── TEAM (ExeCom) ────────────────────────────────────────────────────────
  await Team.insertMany([
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chair',
      bio: 'Senior engineering leader with 20+ years of experience in technology management and innovation strategy. IEEE Senior Member.',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      email: 'chair@ieee-tems-bangalore.org',
      linkedin: 'https://linkedin.com',
      year: 2026, order: 1
    },
    {
      name: 'Ms. Priya Sharma',
      role: 'Vice Chair',
      bio: 'Product management professional with expertise in agile methodologies and cross-functional team leadership.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      email: 'vicechair@ieee-tems-bangalore.org',
      linkedin: 'https://linkedin.com',
      year: 2026, order: 2
    },
    {
      name: 'Mr. Arjun Nair',
      role: 'Secretary',
      bio: 'Technology strategist with a background in operations management and process optimisation.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      email: 'secretary@ieee-tems-bangalore.org',
      linkedin: 'https://linkedin.com',
      year: 2026, order: 3
    },
    {
      name: 'Ms. Kavitha Reddy',
      role: 'Treasurer',
      bio: 'Finance and programme management specialist with extensive experience in IEEE volunteer leadership.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      email: 'treasurer@ieee-tems-bangalore.org',
      linkedin: 'https://linkedin.com',
      year: 2026, order: 4
    },
    {
      name: 'Mr. Rushit Jani',
      role: 'Section Student Representative',
      bio: 'Engineering student passionate about bridging academia and industry through IEEE TEMS activities and student branch initiatives.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      email: 'rushitjaniofficial895@ieee.org',
      linkedin: 'https://www.linkedin.com/in/rushit-jani/',
      year: 2026, order: 5
    },
    {
      name: 'Ms. Aesha Italiya',
      role: 'Web Lead',
      bio: 'Full-stack web developer and digital communications lead managing IEEE TEMS Bangalore\'s online presence.',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      email: 'aeshaitaliya123@gmail.com',
      linkedin: 'https://www.linkedin.com/in/aesha-italiya-74087633b/',
      year: 2026, order: 6
    },
  ]);

  // ─── BLOGS ────────────────────────────────────────────────────────────────
  await Blog.insertMany([
    {
      title: 'The Future of Engineering Management in the Age of AI',
      content: 'Artificial intelligence is fundamentally reshaping how engineering organisations are managed. From automated project tracking to AI-assisted decision-making, leaders must adapt their management frameworks to stay relevant. This article explores the key shifts every engineering manager needs to understand.',
      author: 'Dr. Rajesh Kumar',
      category: 'Technology Management',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      date: new Date('2026-05-10'),
      articleUrl: '#'
    },
    {
      title: 'Building High-Performance Engineering Teams: Lessons from the Field',
      content: 'What separates good engineering teams from great ones? After years of observing high-performing organisations, several consistent patterns emerge around psychological safety, clear ownership, and continuous learning cultures.',
      author: 'Ms. Priya Sharma',
      category: 'Leadership',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      date: new Date('2026-04-22'),
      articleUrl: '#'
    },
    {
      title: 'IEEE TEMS Bangalore — Highlights from TEMSCON 2025',
      content: 'The annual TEMSCON brought together over 300 participants from across India. Keynote speakers from ISRO, Infosys, and global IEEE leadership shared insights on technology strategy, digital transformation, and sustainable innovation.',
      author: 'IEEE TEMS Bangalore',
      category: 'Event Recap',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      date: new Date('2026-03-15'),
      articleUrl: '#'
    },
    {
      title: 'Design Thinking: A Practical Guide for Engineers',
      content: 'Design thinking is no longer just a buzzword — it\'s become an essential toolkit for engineers solving complex, human-centred problems. This guide walks through the five stages and how to apply them in real engineering contexts.',
      author: 'Mr. Arjun Nair',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      date: new Date('2026-02-28'),
      articleUrl: '#'
    },
  ]);

  // ─── STUDENT BRANCHES ─────────────────────────────────────────────────────
  await StudentBranch.insertMany([
    {
      name: 'REVA University TEMS Student Branch',
      city: 'Bangalore',
      description: 'Active TEMS student chapter at REVA University driving innovation and leadership excellence on campus.',
      institutionImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
      formationDate: new Date('2022-03-10'),
      memberCount: 85,
      website: 'https://reva.edu.in',
      socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      advisor: { name: 'Dr. Suresh M.', linkedin: 'https://linkedin.com' },
      chair: { name: 'Ms. Aesha Italiya', linkedin: 'https://www.linkedin.com/in/aesha-italiya-74087633b/' },
      latitude: 13.1140, longitude: 77.6024, order: 1
    },
    {
      name: 'BMS College of Engineering TEMS Branch',
      city: 'Bangalore',
      description: 'Empowering BMSCE students with technology management skills through workshops, talks, and competitions.',
      institutionImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
      formationDate: new Date('2021-08-20'),
      memberCount: 110,
      website: 'https://bmsce.ac.in',
      socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      advisor: { name: 'Dr. Pradeep K.', linkedin: 'https://linkedin.com' },
      chair: { name: 'Mr. Rohit Shetty', linkedin: 'https://linkedin.com' },
      latitude: 12.9402, longitude: 77.5636, order: 2
    },
    {
      name: 'RV College of Engineering TEMS Branch',
      city: 'Bangalore',
      description: 'RVCE\'s TEMS branch focuses on bridging technical education with management thinking for holistic engineering excellence.',
      institutionImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
      formationDate: new Date('2020-11-05'),
      memberCount: 120,
      website: 'https://rvce.edu.in',
      socialLinks: { linkedin: 'https://linkedin.com' },
      advisor: { name: 'Prof. Anita R.', linkedin: 'https://linkedin.com' },
      chair: { name: 'Mr. Kiran Raj', linkedin: 'https://linkedin.com' },
      latitude: 12.9230, longitude: 77.4985, order: 3
    },
    {
      name: 'PES University TEMS Student Branch',
      city: 'Bangalore',
      description: 'PES University TEMS branch actively organises hackathons, leadership seminars, and industry connect programmes.',
      institutionImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80',
      formationDate: new Date('2023-01-15'),
      memberCount: 65,
      website: 'https://pes.edu',
      socialLinks: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      advisor: { name: 'Dr. Meena V.', linkedin: 'https://linkedin.com' },
      chair: { name: 'Ms. Sneha Pai', linkedin: 'https://linkedin.com' },
      latitude: 12.9340, longitude: 77.5354, order: 4
    },
    {
      name: 'MS Ramaiah Institute of Technology TEMS Branch',
      city: 'Bangalore',
      description: 'MSRIT TEMS chapter is committed to fostering a culture of innovation and strategic thinking among engineering students.',
      institutionImage: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&q=80',
      formationDate: new Date('2022-07-01'),
      memberCount: 95,
      website: 'https://msrit.edu',
      socialLinks: { instagram: 'https://instagram.com' },
      advisor: { name: 'Prof. Srinivas B.', linkedin: 'https://linkedin.com' },
      chair: { name: 'Mr. Aditya M.', linkedin: 'https://linkedin.com' },
      latitude: 13.0008, longitude: 77.5659, order: 5
    },
  ]);

  // ─── PAST EXECOM ──────────────────────────────────────────────────────────
  await PastExeCom.insertMany([
    { name: 'Dr. Venkatesh Rao', role: 'Chair', year: 2025, linkedin: 'https://linkedin.com', order: 1 },
    { name: 'Ms. Divya Menon', role: 'Vice Chair', year: 2025, linkedin: 'https://linkedin.com', order: 2 },
    { name: 'Mr. Sunil Joshi', role: 'Secretary', year: 2025, linkedin: 'https://linkedin.com', order: 3 },
    { name: 'Dr. Anand Murthy', role: 'Chair', year: 2024, linkedin: 'https://linkedin.com', order: 4 },
    { name: 'Ms. Rekha Nair', role: 'Vice Chair', year: 2024, linkedin: 'https://linkedin.com', order: 5 },
  ]);

  // ─── PAGE CONTENT (Page Heroes — admin editable) ──────────────────────────
  await PageContent.insertMany([
    {
      page: 'branches', section: 'hero',
      title: 'Empowering Student Innovation <br>Across <span>Karnataka</span>',
      subtitle: 'Student Network',
      content: 'Connecting thousands of bright minds through a robust network of TEMS student chapters in premier institutes.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'branches', section: 'map-desc',
      content: 'Our student branches span premier technical institutes across Karnataka, forming a connected ecosystem of future technology leaders.',
      order: 2
    },
    {
      page: 'about', section: 'hero',
      title: 'Where Technology <br>Meets <span>Leadership</span>',
      subtitle: 'Global Excellence • Local Impact',
      content: 'Positioning technical professionals for success in leadership roles since 1951. We are the premier resource for engineering management sciences.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'execom', section: 'hero',
      title: 'Executive <br><span>Committee</span>',
      subtitle: 'Strategic Leadership',
      content: 'Meet the dedicated team of professionals and visionaries driving the mission of IEEE TEMS Bangalore Section across generations.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'blogs', section: 'hero',
      title: 'Latest <br><span>News & Insights</span>',
      subtitle: 'Section Updates',
      content: 'Deep dives into technology management, section announcements, and expert perspectives from our community.',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'resources', section: 'hero',
      title: 'Resources <br>& <span>Brand Assets</span>',
      subtitle: 'Knowledge Hub',
      content: 'Official logos, templates, AGM reports, and downloadable materials for the IEEE TEMS Bangalore community.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'contact', section: 'hero',
      title: 'Get In <br><span>Touch</span>',
      subtitle: 'We\'d Love To Hear From You',
      content: 'Reach out to us for any inquiries, collaborations, sponsorships, or support — our team responds within 48 hours.',
      image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'join', section: 'hero',
      title: 'Join IEEE <br><span>TEMS Bangalore</span>',
      subtitle: 'Strategic Growth',
      content: 'Become a leader at the intersection of technology and management. Gain exclusive access to a global network of innovators and professionals shaping the future.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
    {
      page: 'search', section: 'hero',
      title: 'Search <br><span>Results</span>',
      subtitle: 'Find What You Need',
      content: 'Search across events, blogs, team members, branches and resources from one place.',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000',
      mediaType: 'image',
      order: 1
    },
  ]);

  console.log('✅ Demo data seeded successfully!');
  console.log('   → Events: 5');
  console.log('   → Team: 6 members');
  console.log('   → Blogs: 4');
  console.log('   → Student Branches: 5');
  console.log('   → Past ExeCom: 5');
  console.log('   → Home sections: hero, counters, about, presence, chair, gallery');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
