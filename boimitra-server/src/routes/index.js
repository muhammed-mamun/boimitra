const express = require('express');

// Import individual route files
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const bookRoutes = require('./book.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/books', bookRoutes);

module.exports = router;
