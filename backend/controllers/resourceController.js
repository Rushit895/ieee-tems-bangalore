const Resource = require('../models/Resource');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ order: 1, name: 1 });
    successResponse(res, resources);
  } catch (err) {
    console.error('[CONTROLLER][Resource][getResources]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const resourceData = { ...req.body };
    if (req.file) resourceData.previewImage = fileValue(req.file);
    const resource = await Resource.create(resourceData);
    successResponse(res, resource, 201);
  } catch (err) {
    console.error('[CONTROLLER][Resource][createResource]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const resourceData = { ...req.body };
    if (req.file) resourceData.previewImage = fileValue(req.file);
    const resource = await Resource.findByIdAndUpdate(req.params.id, resourceData, {
      new: true,
      runValidators: true
    });
    if (!resource) return errorResponse(res, 'Resource not found', 404);
    successResponse(res, resource);
  } catch (err) {
    console.error('[CONTROLLER][Resource][updateResource]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return errorResponse(res, 'Resource not found', 404);
    successResponse(res, { message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][Resource][deleteResource]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
