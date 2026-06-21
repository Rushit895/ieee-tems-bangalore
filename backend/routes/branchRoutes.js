const express = require('express');
const { getBranches, createBranch, updateBranch, deleteBranch } = require('../controllers/branchController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getBranches)
  .post(protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'advisorPhoto', maxCount: 1 }, { name: 'chairPhoto', maxCount: 1 }]), createBranch);

router.route('/:id')
  .put(protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'advisorPhoto', maxCount: 1 }, { name: 'chairPhoto', maxCount: 1 }]), updateBranch)
  .delete(protect, deleteBranch);

module.exports = router;
