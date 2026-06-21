const express = require('express');
const { getBlogs, createBlog, deleteBlog, updateBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/').get(getBlogs).post(protect, upload.single('image'), createBlog);
router.route('/:id')
    .get(require('../controllers/blogController').getBlogById)
    .put(protect, upload.single('image'), updateBlog)
    .delete(protect, deleteBlog);

module.exports = router;