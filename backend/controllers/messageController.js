const Message = require('../models/Contact');
const { successResponse, errorResponse } = require('../utils/response');

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    successResponse(res, messages);
  } catch (err) {
    console.error('[CONTROLLER][Message][getMessages]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return errorResponse(res, 'Please provide all required fields', 400);
    }
    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });
    successResponse(res, newMessage, 201);
  } catch (err) {
    console.error('[CONTROLLER][Message][createMessage]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'replied'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }
    const message = await Message.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });
    if (!message) return errorResponse(res, 'Message not found', 404);
    successResponse(res, message);
  } catch (err) {
    console.error('[CONTROLLER][Message][updateMessageStatus]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return errorResponse(res, 'Message not found', 404);
    successResponse(res, { message: 'Message deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][Message][deleteMessage]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
