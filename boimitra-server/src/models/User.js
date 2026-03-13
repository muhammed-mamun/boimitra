const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false
        },
        city: {
            type: String,
            trim: true
        },
        avatar_url: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: '',
            trim: true
        },
        favorite_categories: {
            type: [String],
            default: []
        },
        books_shared: {
            type: Number,
            default: 0
        },
        reputation_score: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // Automatically map timestamps to schema format
    }
);

// Hash the password before saving the user document
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare provided password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
