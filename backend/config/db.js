const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ieee-tems');
    // This will be logged by the 'open' event listener below
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`FATAL: Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

module.exports = connectDB;