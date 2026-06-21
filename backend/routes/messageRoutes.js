const express = require('express');
const { getMessages, createMessage, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createMessage)
  .get(protect, getMessages);

router.route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);

module.exports = router;