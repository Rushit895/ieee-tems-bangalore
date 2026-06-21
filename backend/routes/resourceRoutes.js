const express = require('express');
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getResources)
  .post(protect, upload.single('image'), createResource);

router.route('/:id')
  .put(protect, upload.single('image'), updateResource)
  .delete(protect, deleteResource);

module.exports = router;
