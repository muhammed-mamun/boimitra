const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find().select('-journey -waitlist'); // exclude heavy lists for index view
        res.status(200).json(books);
    } catch (error) {
        console.error('getBooks error:', error);
        res.status(500).json({ message: 'Server error fetching books', error: error.message });
    }
};

// @desc    Get all distinct categories
// @route   GET /api/books/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        // Filter out null/undefined/empty
        const validCategories = categories.filter(c => c && c.trim().length > 0);
        res.status(200).json(validCategories.sort());
    } catch (error) {
        console.error('getCategories error:', error);
        res.status(500).json({ message: 'Server error fetching categories', error: error.message });
    }
};

// @desc    Get data for Journey Map (Stats and Most Travelled Book)
// @route   GET /api/books/journey-map-data
// @access  Public
exports.getJourneyMapData = async (req, res) => {
    try {
        const users = await User.find();
        const books = await Book.find();

        const stats = {
            'Dhaka': { nameBn: 'ঢাকা', readers: 0, books: 0, handoffs: 0 },
            'Chittagong': { nameBn: 'চট্টগ্রাম', readers: 0, books: 0, handoffs: 0 },
            'Rajshahi': { nameBn: 'রাজশাহী', readers: 0, books: 0, handoffs: 0 },
            'Khulna': { nameBn: 'খুলনা', readers: 0, books: 0, handoffs: 0 },
            'Barisal': { nameBn: 'বরিশাল', readers: 0, books: 0, handoffs: 0 },
            'Sylhet': { nameBn: 'সিলেট', readers: 0, books: 0, handoffs: 0 },
            'Rangpur': { nameBn: 'রংপুর', readers: 0, books: 0, handoffs: 0 },
            'Mymensingh': { nameBn: 'ময়মনসিংহ', readers: 0, books: 0, handoffs: 0 },
        };

        // Aggregating readers per division
        users.forEach(u => {
            if (stats[u.city]) stats[u.city].readers++;
        });

        let mostTravelledBook = null;
        let maxJumps = -1;

        // Aggregating active books and handoffs
        books.forEach(b => {
            const currentDiv = b.current_holder?.city;
            if (currentDiv && stats[currentDiv]) stats[currentDiv].books++;

            b.journey.forEach(j => {
                if (stats[j.city]) stats[j.city].handoffs++;
            });

            if (b.journey.length > maxJumps) {
                maxJumps = b.journey.length;
                mostTravelledBook = b;
            }
        });

        let featuredJourney = [];
        let bookTitle = "No Book Travelling Yet";

        if (mostTravelledBook && mostTravelledBook.journey.length > 0) {
            bookTitle = mostTravelledBook.title;

            let previousLoc = 'Dhaka'; // Default starting point
            if (mostTravelledBook.owner_id) {
                const owner = users.find(u => u._id.toString() === mostTravelledBook.owner_id.toString());
                if (owner && owner.city) previousLoc = owner.city;
            }

            mostTravelledBook.journey.forEach((j, idx) => {
                featuredJourney.push({
                    id: j._id?.toString() || idx.toString(),
                    from: previousLoc,
                    to: j.city,
                    reader: j.name,
                    date: j.to ? new Date(j.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown',
                    review: j.review
                });
                previousLoc = j.city;
            });

            if (mostTravelledBook.current_holder) {
                featuredJourney.push({
                    id: 'current',
                    from: previousLoc,
                    to: mostTravelledBook.current_holder.city,
                    reader: mostTravelledBook.current_holder.name,
                    date: mostTravelledBook.current_holder.received_at ? new Date(mostTravelledBook.current_holder.received_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Now',
                    review: 'Currently Reading...'
                });
            }
        }

        res.status(200).json({ stats, featuredJourney, bookTitle });
    } catch (error) {
        console.error('getJourneyMapData error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single book details including journey
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error('getBookById error:', error);
        res.status(500).json({ message: 'Server error fetching book', error: error.message });
    }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res) => {
    try {
        const { title, titleBn, author, category, tags, cover_url, description } = req.body;

        const newBook = new Book({
            title,
            titleBn,
            author,
            category,
            tags,
            cover_url,
            description,
            owner_id: req.user.id
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('createBook error:', error);
        res.status(500).json({ message: 'Server error creating book', error: error.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Optional: Ensure only owner or admin can update, but skipping for simplicity
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('updateBook error:', error);
        res.status(500).json({ message: 'Server error updating book', error: error.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book removed successfully' });
    } catch (error) {
        console.error('deleteBook error:', error);
        res.status(500).json({ message: 'Server error deleting book', error: error.message });
    }
};

// @desc    Request to read a book (Join Waitlist)
// @route   POST /api/books/:id/request
// @access  Private
exports.requestBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const user = await User.findById(req.user.id);
        const location = req.body.location; // Example: { lat: 23.81, lng: 90.41 }

        // Check if already in waitlist
        const isWaiting = book.waitlist.some(w => w.user_id.toString() === req.user.id);
        if (isWaiting) {
            return res.status(400).json({ message: 'You are already in the waitlist for this book' });
        }

        // Check if currently holding the book
        if (book.current_holder && book.current_holder.user_id && book.current_holder.user_id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You are currently holding this book!' });
        }

        // If NO current holder exists, immediately assign the book to the requester
        if (!book.current_holder || !book.current_holder.user_id) {
            // Assign immediately
            book.current_holder = {
                user_id: user._id,
                name: user.name,
                city: user.city,
                location,
                received_at: new Date(),
                due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // + 7 days
            };
            book.available = false;
        } else {
            // Join waitlist
            book.waitlist.push({
                user_id: user._id,
                name: user.name,
                city: user.city,
                location,
                status: 'pending'
            });
        }

        await book.save();
        res.status(200).json({ message: 'Request processed', book });
    } catch (error) {
        console.error('requestBook error:', error);
        res.status(500).json({ message: 'Server error requesting book', error: error.message });
    }
};

// @desc    Get waitlist for a specific book
// @route   GET /api/books/:id/waitlist
// @access  Public
exports.getWaitlist = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).select('waitlist');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book.waitlist);
    } catch (error) {
        console.error('getWaitlist error:', error);
        res.status(500).json({ message: 'Server error fetching waitlist', error: error.message });
    }
};

// @desc    Submit rating/review and hand off book to next reader in queue
// @route   POST /api/books/:id/review
// @access  Private
exports.submitReviewAndHandoff = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Verify the user is the current holder
        if (!book.current_holder || !book.current_holder.user_id || book.current_holder.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the current holder of this book' });
        }

        // 1. Add journey entry
        book.journey.push({
            user_id: book.current_holder.user_id,
            name: book.current_holder.name,
            city: book.current_holder.city,
            location: book.current_holder.location,
            rating: rating || 5, // Defaulting if not provided
            review: review || '',
            from: book.current_holder.received_at,
            to: new Date()
        });

        // 2. Remove current holder and pass to next in waitlist (Gamification!)
        if (book.waitlist && book.waitlist.length > 0) {
            // Get the first person in the waitlist
            const nextUser = book.waitlist.shift(); // Removes them from array and returns

            book.current_holder = {
                user_id: nextUser.user_id,
                name: nextUser.name,
                city: nextUser.city,
                location: nextUser.location,
                received_at: new Date(),
                due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            };
        } else {
            // No one is waiting -> book becomes totally free/available
            book.current_holder = null;
            book.available = true;
        }

        await book.save();
        res.status(200).json({ message: 'Review submitted and journey updated!', journey: book.journey });
    } catch (error) {
        console.error('submitReviewAndHandoff error:', error);
        res.status(500).json({ message: 'Server error during handoff', error: error.message });
    }
};
