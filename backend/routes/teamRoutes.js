const express = require('express');
const { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getTeamMembers)
  .post(protect, upload.single('photo'), createTeamMember);

router.route('/:id')
  .put(protect, upload.single('photo'), updateTeamMember)
  .delete(protect, deleteTeamMember);

module.exports = router;