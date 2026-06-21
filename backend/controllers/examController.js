const Exam = require('../models/Exam');
const { successResponse, errorResponse } = require('../utils/response');

exports.getExams = async (req, res, next) => {
  try {
    const { year } = req.query;
    let query = {};
    if (year) query.year = parseInt(year);
    const exams = await Exam.find(query).sort({ date: -1 });
    successResponse(res, exams);
  } catch (err) {
    console.error('[CONTROLLER][Exam][getExams]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const examData = { ...req.body };
    if (req.file) examData.fileUrl = req.file.filename;
    const exam = await Exam.create(examData);
    successResponse(res, exam, 201);
  } catch (err) {
    console.error('[CONTROLLER][Exam][createExam]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const examData = { ...req.body };
    if (req.file) examData.fileUrl = req.file.filename;
    const exam = await Exam.findByIdAndUpdate(req.params.id, examData, {
      new: true,
      runValidators: true
    });
    if (!exam) return errorResponse(res, 'Exam not found', 404);
    successResponse(res, exam);
  } catch (err) {
    console.error('[CONTROLLER][Exam][updateExam]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return errorResponse(res, 'Exam not found', 404);
    successResponse(res, { message: 'Exam deleted successfully' });
  } catch (err) {
    console.error('[CONTROLLER][Exam][deleteExam]', err.message, err.stack);
    errorResponse(res, err.message);
  }
};
