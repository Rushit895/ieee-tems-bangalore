const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const StudentBranch = require('../models/StudentBranch');
const Team = require('../models/Team');
const Blog = require('../models/Blog');
const Exam = require('../models/Exam');
const { successResponse, errorResponse } = require('../utils/response');

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return successResponse(res, { results: [], total: 0, query: q || '' });
    }

    const regex = new RegExp(q.trim(), 'i');

    const [events, branches, team, blogs, exams] = await Promise.all([
      Event.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }]
      }).limit(5).lean(),

      StudentBranch.find({
        $or: [{ name: regex }, { city: regex }, { description: regex }]
      }).limit(5).lean(),

      Team.find({
        $or: [{ name: regex }, { role: regex }, { bio: regex }]
      }).limit(5).lean(),

      Blog.find({
        $or: [{ title: regex }, { content: regex }, { author: regex }, { category: regex }]
      }).limit(5).lean(),

      Exam.find({
        $or: [{ title: regex }, { description: regex }]
      }).limit(5).lean()
    ]);

    const results = [
      ...events.map(e => ({
        id: e._id, type: 'Event', icon: '📅',
        title: e.title,
        description: e.description ? e.description.substring(0, 100) : '',
        link: 'events.html'
      })),
      ...branches.map(b => ({
        id: b._id, type: 'Student Branch', icon: '🏫',
        title: b.name,
        description: b.city || '',
        link: 'branches.html'
      })),
      ...team.map(t => ({
        id: t._id, type: 'Team Member', icon: '👤',
        title: t.name,
        description: t.role || '',
        link: 'execom.html'
      })),
      ...blogs.map(b => ({
        id: b._id, type: 'Blog', icon: '📝',
        title: b.title,
        description: b.content ? b.content.substring(0, 100) : '',
        link: `blog-detail.html?id=${b._id}`
      })),
      ...exams.map(e => ({
        id: e._id, type: 'Exam', icon: '📄',
        title: e.title,
        description: e.description ? e.description.substring(0, 100) : '',
        link: 'past-exams.html'
      }))
    ];

    console.log(`[SEARCH] query="${q.trim()}" → ${results.length} results`);
    successResponse(res, { results, total: results.length, query: q.trim() });

  } catch (err) {
    console.error('[CONTROLLER][Search][search]', err.message, err.stack);
    errorResponse(res, err.message);
  }
});

module.exports = router;
