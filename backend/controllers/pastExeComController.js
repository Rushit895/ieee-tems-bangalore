const fs = require('fs');
const path = require('path');
const PastExeCom = require('../models/PastExeCom');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getAll = async (req, res) => {
  try {
    const members = await PastExeCom.find().sort({ year: -1, order: 1 });
    console.log(`[GET /api/past-execom] Found ${members.length} members.`);
    successResponse(res, members);
  } catch (err) {
    console.error('[CONTROLLER][PastExeCom][getAll]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.['photo']?.[0]) {
      data.photo = fileValue(req.files['photo'][0]);
    }
    const member = await PastExeCom.create(data);
    console.log(`[CONTROLLER][PastExeCom][create] Created ${member._id}`);
    successResponse(res, member, 201);
  } catch (err) {
    console.error('[CONTROLLER][PastExeCom][create]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.['photo']?.[0]) {
      data.photo = fileValue(req.files['photo'][0]);
    }
    const member = await PastExeCom.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!member) return errorResponse(res, 'Member not found', 404);
    console.log(`[CONTROLLER][PastExeCom][update] Updated ${member._id}`);
    successResponse(res, member);
  } catch (err) {
    console.error('[CONTROLLER][PastExeCom][update]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {
    const member = await PastExeCom.findByIdAndDelete(req.params.id);
    if (!member) return errorResponse(res, 'Member not found', 404);
    // Delete photo file from disk if it exists and is a local upload
    if (member.photo && !member.photo.startsWith('http')) {
      const filePath = path.join(__dirname, '../uploads', member.photo);
      fs.unlink(filePath, (err) => {
        if (err) console.warn(`[PastExeCom] Could not delete photo file: ${filePath}`);
      });
    }
    console.log(`[CONTROLLER][PastExeCom][remove] Deleted ${req.params.id}`);
    successResponse(res, { message: 'Member deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][PastExeCom][remove]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
