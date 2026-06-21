const StudentBranch = require('../models/StudentBranch');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await StudentBranch.find().sort({ order: 1, name: 1 });
    console.log(`[GET /api/branches] Found ${branches.length} branches in MongoDB.`);
    successResponse(res, branches);
  } catch (err) {
    console.error('[CONTROLLER][StudentBranch][getBranches]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createBranch = async (req, res, next) => {
  try {
    const branchData = { ...req.body };
    console.log(`[POST /api/branches] Incoming data for: ${branchData.name}`);
    ['socialLinks', 'advisor', 'chair'].forEach(field => {
      if (typeof branchData[field] === 'string') {
        try { branchData[field] = JSON.parse(branchData[field]); } catch (e) {}
      }
    });
    if (req.files) {
      if (req.files['image']?.[0]) branchData.institutionImage = fileValue(req.files['image'][0]);
      if (req.files['advisorPhoto']?.[0]) {
        if (!branchData.advisor) branchData.advisor = {};
        branchData.advisor.photo = fileValue(req.files['advisorPhoto'][0]);
      }
      if (req.files['chairPhoto']?.[0]) {
        if (!branchData.chair) branchData.chair = {};
        branchData.chair.photo = fileValue(req.files['chairPhoto'][0]);
      }
    }
    const newBranch = await StudentBranch.create(branchData);
    console.log(`[DATABASE WRITE SUCCESS] Branch "${newBranch.name}" saved with ID: ${newBranch._id}`);
    successResponse(res, newBranch, 201);
  } catch (err) {
    console.error('[CONTROLLER][StudentBranch][createBranch]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const branchData = { ...req.body };
    ['socialLinks', 'advisor', 'chair'].forEach(field => {
      if (typeof branchData[field] === 'string') {
        try { branchData[field] = JSON.parse(branchData[field]); } catch (e) {}
      }
    });
    if (req.files) {
      if (req.files['image']?.[0]) branchData.institutionImage = fileValue(req.files['image'][0]);
      if (req.files['advisorPhoto']?.[0]) {
        if (!branchData.advisor) branchData.advisor = {};
        branchData.advisor.photo = fileValue(req.files['advisorPhoto'][0]);
      }
      if (req.files['chairPhoto']?.[0]) {
        if (!branchData.chair) branchData.chair = {};
        branchData.chair.photo = fileValue(req.files['chairPhoto'][0]);
      }
    }
    const branch = await StudentBranch.findByIdAndUpdate(req.params.id, branchData, {
      new: true,
      runValidators: true
    });
    if (!branch) return errorResponse(res, 'Branch not found', 404);
    console.log(`[DATABASE UPDATE SUCCESS] Branch "${branch.name}" updated.`);
    successResponse(res, branch);
  } catch (err) {
    console.error('[CONTROLLER][StudentBranch][updateBranch]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await StudentBranch.findByIdAndDelete(req.params.id);
    if (!branch) return errorResponse(res, 'Branch not found', 404);
    console.log(`[DATABASE DELETE SUCCESS] Branch record ${req.params.id} removed.`);
    successResponse(res, { message: 'Branch deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][StudentBranch][deleteBranch]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
