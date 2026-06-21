const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, upload.single('image'), createEvent);

router.route('/:id')
  .put(protect, upload.single('image'), updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;