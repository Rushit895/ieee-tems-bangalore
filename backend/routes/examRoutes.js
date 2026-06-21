const express = require('express');
const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getExams)
  .post(protect, upload.single('file'), createExam);

router.route('/:id')
  .put(protect, upload.single('file'), updateExam)
  .delete(protect, deleteExam);

module.exports = router;