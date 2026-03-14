const express = require('express');
const { getMe, updateMe, getMyHistory, getMyQueue } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);

router.get('/me/history', getMyHistory);
router.get('/me/queue', getMyQueue);

module.exports = router;
