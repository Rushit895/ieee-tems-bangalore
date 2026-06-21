const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/pastExeComController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const photoUpload = upload.fields([{ name: 'photo', maxCount: 1 }]);

router.route('/')
  .get(getAll)
  .post(protect, photoUpload, create);

router.route('/:id')
  .put(protect, photoUpload, update)
  .delete(protect, remove);

module.exports = router;
