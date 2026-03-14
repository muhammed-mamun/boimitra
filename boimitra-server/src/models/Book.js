const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        titleBn: { type: String }, // Bengali title
        author: { type: String, required: true },
        category: { type: String },
        tags: [String],
        cover_url: { type: String },
        description: { type: String },
        available: { type: Boolean, default: true },
        owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tracking who added the book, optional but helpful

        current_holder: {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: String,
            city: String,
            location: {
                lat: Number,
                lng: Number
            },
            received_at: Date,
            due_at: Date
        },

        journey: [
            {
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                name: String,
                city: String,
                location: {
                    lat: Number,
                    lng: Number
                },
                rating: { type: Number, min: 1, max: 5 },
                review: String,
                from: Date,
                to: Date
            }
        ],

        waitlist: [
            {
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                name: String,
                city: String,
                location: {
                    lat: Number,
                    lng: Number
                },
                requested_at: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ['pending', 'confirmed', 'delivered'],
                    default: 'pending'
                }
            }
        ]
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
