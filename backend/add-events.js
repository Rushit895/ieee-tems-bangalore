require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const events = [
    {
      title: 'Entrepreneurship Workshop',
      description: 'The Entrepreneurship Workshop brings together academia, industry leaders, startup founders, and innovation practitioners to explore best practices in entrepreneurship education, startup development, and innovation management. Participants will gain valuable insights, engage in meaningful discussions, and learn strategies to nurture entrepreneurial ecosystems within academic and professional environments. Speakers include Dr. Sudeendra Koushik (President, IEEE TEMS), Dr. Prasant Misra (Chair, IEEE Bangalore Section), Mr. Vivek Saxena (Managing Partner, Vanexas Consulting), Mr. Suresh Narasimha (Co-Founder, CoCreate Ventures), Mr. Ravikiran (CEO & Co-Founder, Numocity Technologies), and Dr. Arvind (Chief Innovation Officer, IIT Jammu).',
      date: new Date('2026-06-27T09:30:00'),
      location: 'BMS College of Engineering, Bull Temple Road, Basavanagudi, Bengaluru, Karnataka - 560004',
      category: 'Workshops',
      organizer: 'IEEE Bangalore Section, IEEE TEMS Bangalore Chapter & IEEE Systems Council'
    },
    {
      title: 'Entrepreneurship Workshop for Faculty',
      description: 'Join us for an intensive, hands-on entrepreneurship workshop designed specifically for faculty members across Karnataka who teach or plan to teach entrepreneurship courses. This full-day interactive session combines theoretical foundations with practical, one-on-one consultations to help develop effective entrepreneurship curricula for institutions. The second half features hands-on consultations on curriculum design, teaching methodologies, and personalized guidance on entrepreneurship syllabus. Expert resource persons include Dr. Aravind (entrepreneurship education specialist) and Suresh Narasimha (Venture Capital expert), along with industry practitioners from IIT Jammu and the Ramaiah Evolute program. Faculty registration: Rs 1,000/-, Student rate: Rs 500/- (50% discount). All participants receive certificates of participation.',
      date: new Date('2026-05-15T09:30:00'),
      location: 'Jain Management College, Bengaluru',
      category: 'Workshops',
      organizer: 'IEEE Bangalore Section, IEEE TEMS Bangalore Chapter & IEEE Systems Council'
    }
  ];

  for (const e of events) {
    await Event.findOneAndUpdate(
      { title: e.title },
      e,
      { upsert: true, new: true }
    );
    console.log('Added/Updated:', e.title);
  }

  mongoose.disconnect();
}

run().catch(err => {
  console.error('Failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
