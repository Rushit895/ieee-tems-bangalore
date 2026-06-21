const { 
    LiveUpdate, HeroSlide, Counter, Karnataka, 
    GifSection, ChairMessage, HomeGallery, HomeUpdate, Activity,
    MembershipCategory, Advantage, JoinStep, FocusArea, SocialLink, AboutIntro, ContactInfo, PageContent 
    } = require('../models/HomeModels');
const { successResponse, errorResponse } = require('../utils/response');
const { fileValueRooted } = require('../middleware/uploadMiddleware');

    const createCRUD = (Model) => ({
    get: async (req, res, next) => {
        try {
            const { page, section } = req.query;
            let filter = {};
            if (page) filter.page = page;
            if (section) filter.section = section;
            const data = await Model.find(filter).sort({ order: 1, createdAt: -1 });
            console.log(`[DATABASE FETCH] Found ${data.length} records in ${Model.modelName}.`);
            successResponse(res, data);
        } catch (err) {
            console.error(`[CONTROLLER][${Model.modelName}][get]`, err.message, err.stack);
            errorResponse(res, err.message);
        }
    },
    create: async (req, res, next) => {
        try {
            console.log(`[REQUEST RECEIVED] POST ${req.originalUrl} | body keys: ${Object.keys(req.body).join(', ')} | file: ${req.file ? req.file.originalname : 'none'}`);
            const itemData = { ...req.body };
            Object.keys(itemData).forEach(key => {
                if (typeof itemData[key] === 'string' && (itemData[key].startsWith('[') || itemData[key].startsWith('{'))) {
                    try { itemData[key] = JSON.parse(itemData[key]); } catch (e) {}
                }
            });
            if (req.file) {
                itemData[req.file.fieldname] = fileValueRooted(req.file);
                console.log(`[FILE SAVED PATH] ${req.file.fieldname} = ${itemData[req.file.fieldname]} (type: ${req.file.mimetype}, size: ${req.file.size} bytes)`);
            }
            const item = await Model.create(itemData);
            console.log(`[DATABASE WRITE SUCCESS] New record saved in ${Model.modelName}: ID ${item._id}`);
            successResponse(res, item, 201);
        } catch (err) {
            console.error(`[CONTROLLER][${Model.modelName}][create]`, err.message, err.stack);
            errorResponse(res, err.message);
        }
    },
    update: async (req, res, next) => {
        try {
            console.log(`[REQUEST RECEIVED] PUT ${req.originalUrl} | body keys: ${Object.keys(req.body).join(', ')} | file: ${req.file ? req.file.originalname : 'none'}`);
            const itemData = { ...req.body };
            Object.keys(itemData).forEach(key => {
                if (typeof itemData[key] === 'string' && (itemData[key].startsWith('[') || itemData[key].startsWith('{'))) {
                    try { itemData[key] = JSON.parse(itemData[key]); } catch (e) {}
                }
            });
            if (req.file) {
                itemData[req.file.fieldname] = fileValueRooted(req.file);
                console.log(`[FILE SAVED PATH] ${req.file.fieldname} = ${itemData[req.file.fieldname]} (type: ${req.file.mimetype}, size: ${req.file.size} bytes)`);
            }
            const item = await Model.findByIdAndUpdate(req.params.id, itemData, { 
                new: true, 
                runValidators: true 
            });
            if (!item) return errorResponse(res, 'Item not found', 404);
            console.log(`[DATABASE UPDATE SUCCESS] Record ${req.params.id} updated in ${Model.modelName}.`);
            successResponse(res, item);
        } catch (err) {
            console.error(`[CONTROLLER][${Model.modelName}][update]`, err.message, err.stack);
            errorResponse(res, err.message);
        }
    },
    delete: async (req, res, next) => {
        try {
            const item = await Model.findByIdAndDelete(req.params.id);
            if (!item) return errorResponse(res, 'Item not found', 404);
            console.log(`[DATABASE DELETE SUCCESS] Record ${req.params.id} removed from ${Model.modelName}.`);
            successResponse(res, { message: 'Deleted successfully' });
        } catch (err) {
            console.error(`[CONTROLLER][${Model.modelName}][delete]`, err.message, err.stack);
            errorResponse(res, err.message);
        }
    }
    });

    module.exports = {
    liveUpdates: createCRUD(LiveUpdate),
    heroSlides: createCRUD(HeroSlide),
    counters: createCRUD(Counter),
    karnataka: createCRUD(Karnataka),
    gifSection: createCRUD(GifSection),
    chairMessage: createCRUD(ChairMessage),
    homeGallery: createCRUD(HomeGallery),
    homeUpdates: createCRUD(HomeUpdate),
    activities: createCRUD(Activity),
    membershipCategories: createCRUD(MembershipCategory),
    advantages: createCRUD(Advantage),
    joinSteps: createCRUD(JoinStep),
    focusAreas: createCRUD(FocusArea),
    socialLinks: createCRUD(SocialLink),
    aboutIntro: createCRUD(AboutIntro),
    contactInfo: createCRUD(ContactInfo),
    pageContent: createCRUD(PageContent)
    };
