const express = require('express');
const router = express.Router();
const { HomeGallery } = require('../models/HomeModels');
const upload = require('../middleware/uploadMiddleware');
const { successResponse, errorResponse } = require('../utils/response');

router.get('/', async (req, res, next) => {
    try {
        const images = await HomeGallery.find().sort({ createdAt: -1 });
        console.log(`[API] GET /gallery returned ${images.length} items`);
        successResponse(res, images);
    } catch (err) {
        console.error('[ROUTE][gallery][GET]', err.message, err.stack);
        errorResponse(res, err.message);
    }
});

router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file && !req.body.imageUrl) {
            return errorResponse(res, 'Please provide an image file or URL', 400);
        }
        const imageUrl = req.file ? upload.fileValueRooted(req.file) : req.body.imageUrl;
        const caption = req.body.caption || '';
        console.log(`[API] POST /gallery saving imageUrl: ${imageUrl}`);
        const newItem = await HomeGallery.create({ imageUrl, caption });
        successResponse(res, newItem, 201);
    } catch (err) {
        console.error('[ROUTE][gallery][POST]', err.message, err.stack);
        errorResponse(res, err.message);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const item = await HomeGallery.findByIdAndDelete(req.params.id);
        if (!item) return errorResponse(res, 'Item not found', 404);
        successResponse(res, { message: 'Image deleted successfully' });
    } catch (err) {
        console.error('[ROUTE][gallery][DELETE]', err.message, err.stack);
        errorResponse(res, err.message);
    }
});

module.exports = router;
