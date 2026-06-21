require('dotenv').config({ override: true });
console.log(`[Config] PORT=${process.env.PORT} MONGO=${process.env.MONGO_URI}`);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
// ── CORS allow-list ─────────────────────────────────────────────────────
// Production origins are always allowed; localhost dev origins are added only
// when NODE_ENV !== 'production'. Add the deployed frontend origin (Netlify URL)
// to PRODUCTION_ORIGINS once known, then set NODE_ENV=production on the server.
const PRODUCTION_ORIGINS = [
  'https://chapters.bangalore.ieee-tems.org',
  'https://ieee-tems-bangalore.netlify.app',
  'https://admintemsblr.netlify.app',
];
const DEV_ORIGINS = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'];
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? PRODUCTION_ORIGINS
  : [...PRODUCTION_ORIGINS, ...DEV_ORIGINS];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Default Route & Health Check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'IEEE TEMS Bangalore Backend API is active',
    endpoints: {
      events: '/api/events',
      team: '/api/team',
      blogs: '/api/blogs',
      messages: '/api/messages',
      home: '/api/home'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
// app.use('/api/exams', require('./routes/examRoutes'));  // REMOVED - Past Exams feature
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/past-execom', require('./routes/pastExeComRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Handle Multer errors (file size, file type)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ status: 'error', message: 'File too large. Maximum allowed size is 50MB.' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ status: 'error', message: `Unexpected field: ${err.field}` });
  }
  // fileFilter errors (unsupported type)
  if (err.message && err.message.startsWith('Unsupported file type')) {
    return res.status(415).json({ status: 'error', message: err.message });
  }
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error (Unique Constraint)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate Entry: A record with this ${field} already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  🔗 API Base: http://localhost:${PORT}/api
  📁 Static Uploads: http://localhost:${PORT}/uploads
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use.`);
    console.error(`[FIX]   Run: npx kill-port ${PORT}   OR change PORT in .env`);
    process.exit(1);
  } else {
    throw err;
  }
});