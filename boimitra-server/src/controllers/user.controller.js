const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
    try {
        const { name, city, avatar_url, bio, favorite_categories } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (city) updateData.city = city;
        if (avatar_url) updateData.avatar_url = avatar_url;
        if (bio) updateData.bio = bio;
        if (favorite_categories) updateData.favorite_categories = favorite_categories;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('updateMe error:', error);
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

// @desc    Get books user has read/historically held
// @route   GET /api/users/me/history
// @access  Private
exports.getMyHistory = async (req, res) => {
    try {
        const historyBooks = await Book.find({
            'journey.user_id': req.user.id
        }).select('-waitlist -current_holder');

        res.status(200).json(historyBooks);
    } catch (error) {
        console.error('getMyHistory error:', error);
        res.status(500).json({ message: 'Server error fetching history', error: error.message });
    }
};

// @desc    Get books user is waiting for (in waitlist)
// @route   GET /api/users/me/queue
// @access  Private
exports.getMyQueue = async (req, res) => {
    try {
        const queueBooks = await Book.find({
            'waitlist.user_id': req.user.id
        }).select('-journey');

        res.status(200).json(queueBooks);
    } catch (error) {
        console.error('getMyQueue error:', error);
        res.status(500).json({ message: 'Server error fetching queue', error: error.message });
    }
};
