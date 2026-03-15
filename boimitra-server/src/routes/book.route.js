const express = require('express');
const {
    getBooks,
    getCategories,
    getJourneyMapData,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    requestBook,
    getWaitlist,
    submitReviewAndHandoff
} = require('../controllers/book.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/journey-map-data', getJourneyMapData);
router.get('/:id', getBookById);
router.get('/:id/waitlist', getWaitlist);

// Protected routes
router.use(protect);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

router.post('/:id/request', requestBook);
router.post('/:id/review', submitReviewAndHandoff);

module.exports = router;
