const Event = require('../models/Event');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValue } = require('../middleware/uploadMiddleware');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    console.log(`[DATABASE FETCH] Retrieved ${events.length} events.`);
    successResponse(res, events);
  } catch (err) {
    console.error('[CONTROLLER][Event][getEvents]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.image = fileValue(req.file);
    console.log(`[EVENT SAVE] Attempting to save: ${eventData.title}`);
    const event = await Event.create(eventData);
    console.log(`[EVENT SAVE SUCCESS] ID: ${event._id}`);
    successResponse(res, event, 201);
  } catch (err) {
    console.error('[CONTROLLER][Event][createEvent]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.image = fileValue(req.file);
    console.log(`[EVENT UPDATE] Attempting to update ID: ${req.params.id}`);
    const event = await Event.findByIdAndUpdate(req.params.id, eventData, {
      new: true,
      runValidators: true
    });
    if (!event) return errorResponse(res, 'Event not found', 404);
    console.log(`[EVENT UPDATE SUCCESS] ID: ${event._id}`);
    successResponse(res, event);
  } catch (err) {
    console.error('[CONTROLLER][Event][updateEvent]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return errorResponse(res, 'Event not found', 404);
    successResponse(res, { message: 'Event deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][Event][deleteEvent]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
