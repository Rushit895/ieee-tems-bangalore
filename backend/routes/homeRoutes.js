const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Define routes for each section
const sections = [
    { path: 'live-updates', ctrl: 'liveUpdates' },
    { path: 'hero', ctrl: 'heroSlides', upload: 'image' },
    { path: 'counters', ctrl: 'counters' },
    { path: 'karnataka', ctrl: 'karnataka', upload: 'image' },
    { path: 'gif-section', ctrl: 'gifSection', upload: 'gifUrl' },
    { path: 'chair-message', ctrl: 'chairMessage', upload: 'image' },
    { path: 'gallery', ctrl: 'homeGallery', upload: 'image' },
    { path: 'current-updates', ctrl: 'homeUpdates', upload: 'image' },
    { path: 'activities', ctrl: 'activities' },
    { path: 'membership-categories', ctrl: 'membershipCategories' },
    { path: 'advantages', ctrl: 'advantages' },
    { path: 'join-steps', ctrl: 'joinSteps' },
    { path: 'focus-areas', ctrl: 'focusAreas' },
    { path: 'social-links', ctrl: 'socialLinks' },
    { path: 'about-intro', ctrl: 'aboutIntro' },
    { path: 'contact-info', ctrl: 'contactInfo' },
    { path: 'page-content', ctrl: 'pageContent', upload: 'image' }
    ];

sections.forEach(s => {
    router.get(`/${s.path}`, controller[s.ctrl].get);
    
    const uploadMiddleware = s.upload ? upload.single(s.upload) : (req, res, next) => next();
    
    router.post(`/${s.path}`, protect, uploadMiddleware, controller[s.ctrl].create);
    router.put(`/${s.path}/:id`, protect, uploadMiddleware, controller[s.ctrl].update);
    router.delete(`/${s.path}/:id`, protect, controller[s.ctrl].delete);
});

module.exports = router;