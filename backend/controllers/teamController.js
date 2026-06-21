const Team = require('../models/Team');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.find().sort({ year: -1, order: 1 });
    console.log(`[Route] /api/team returned ${team.length} docs`);
    successResponse(res, team);
  } catch (err) {
    console.error('[CONTROLLER][Team][getTeamMembers]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createTeamMember = async (req, res, next) => {
  try {
    const teamData = { ...req.body };
    if (req.file) teamData.photo = fileValue(req.file);
    const newMember = await Team.create(teamData);
    console.log(`[Route] /api/team created new member ${newMember._id}`);
    successResponse(res, newMember, 201);
  } catch (err) {
    console.error('[CONTROLLER][Team][createTeamMember]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateTeamMember = async (req, res, next) => {
  try {
    const teamData = { ...req.body };
    if (req.file) teamData.photo = fileValue(req.file);
    const team = await Team.findByIdAndUpdate(req.params.id, teamData, {
      new: true,
      runValidators: true
    });
    if (!team) return errorResponse(res, 'Team member not found', 404);
    successResponse(res, team);
  } catch (err) {
    console.error('[CONTROLLER][Team][updateTeamMember]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return errorResponse(res, 'Team member not found', 404);
    successResponse(res, { message: 'Team member deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][Team][deleteTeamMember]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
