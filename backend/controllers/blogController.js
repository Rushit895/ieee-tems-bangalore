const Blog = require('../models/Blog');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    console.log(`[DATABASE FETCH] Retrieved ${blogs.length} blog posts.`);
    successResponse(res, blogs);
  } catch (err) {
    console.error('[CONTROLLER][Blog][getBlogs]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return errorResponse(res, 'Blog not found', 404);
    successResponse(res, blog);
  } catch (err) {
    console.error('[CONTROLLER][Blog][getBlogById]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };
    if (req.file) blogData.image = fileValue(req.file);
    const newBlog = await Blog.create(blogData);
    console.log(`[DATABASE WRITE SUCCESS] Blog post "${newBlog.title}" saved.`);
    successResponse(res, newBlog, 201);
  } catch (err) {
    console.error('[CONTROLLER][Blog][createBlog]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };
    if (req.file) blogData.image = fileValue(req.file);
    const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
      new: true,
      runValidators: true
    });
    if (!blog) return errorResponse(res, 'Blog not found', 404);
    successResponse(res, blog);
  } catch (err) {
    console.error('[CONTROLLER][Blog][updateBlog]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return errorResponse(res, 'Blog not found', 404);
    successResponse(res, { message: 'Blog deleted' });
  } catch (err) {
    console.error('[CONTROLLER][Blog][deleteBlog]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
