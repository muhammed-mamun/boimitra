require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Book = require('../models/Book');
const connectDB = require('../config/db');

const NUM_USERS = 40;
const NUM_BOOKS = 150;

// Authentic Bangladesh locations mapped to divisions
const BD_LOCATIONS = [
    { city: 'Dhaka', div: 'Dhaka', lat: 23.8103, lng: 90.4125 },
    { city: 'Gazipur', div: 'Dhaka', lat: 24.0023, lng: 90.4264 },
    { city: 'Chittagong', div: 'Chittagong', lat: 22.3569, lng: 91.7832 },
    { city: 'Cox\'s Bazar', div: 'Chittagong', lat: 21.4272, lng: 92.0058 },
    { city: 'Sylhet', div: 'Sylhet', lat: 24.8949, lng: 91.8687 },
    { city: 'Moulvibazar', div: 'Sylhet', lat: 24.4843, lng: 91.7685 },
    { city: 'Rajshahi', div: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
    { city: 'Bogra', div: 'Rajshahi', lat: 24.8481, lng: 89.3730 },
    { city: 'Khulna', div: 'Khulna', lat: 22.8456, lng: 89.5403 },
    { city: 'Jessore', div: 'Khulna', lat: 23.1634, lng: 89.2182 },
    { city: 'Barisal', div: 'Barisal', lat: 22.7010, lng: 90.3535 },
    { city: 'Patuakhali', div: 'Barisal', lat: 22.3596, lng: 90.3298 },
    { city: 'Rangpur', div: 'Rangpur', lat: 25.7439, lng: 89.2752 },
    { city: 'Dinajpur', div: 'Rangpur', lat: 25.6217, lng: 88.6358 },
    { city: 'Mymensingh', div: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
    { city: 'Jamalpur', div: 'Mymensingh', lat: 24.9250, lng: 89.9463 },
];

const CATEGORIES = [
    'Fiction', 'Poetry', 'History', 'Biography', 'Philosophy',
    'Religion', 'Science', 'Self-Help', 'Travel', 'Classic',
    'Mystery', 'Romance', 'Thriller', 'Children', 'Sci-Fi', 'Islamic'
];

// Helper to generate a small offset for coordinates so markers aren't perfectly stacked
const jitter = (coord) => coord + (Math.random() - 0.5) * 0.05;

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🔴 Wiping existing database records...');
        await User.deleteMany({});
        await Book.deleteMany({});

        console.log(`🟡 Generating ${NUM_USERS} Synthetic Users...`);
        const usersToInsert = [];
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // Always create one reliable test user
        const testUserLoc = faker.helpers.arrayElement(BD_LOCATIONS);
        const testUser = new User({
            name: 'Test Reader',
            email: 'test@example.com',
            password: passwordHash,
            city: testUserLoc.div, // Keep division map compatibility
            phone: '01700000000',
            address: faker.location.streetAddress()
        });
        await testUser.save();
        usersToInsert.push(testUser);

        // Generate rest
        for (let i = 0; i < NUM_USERS - 1; i++) {
            const loc = faker.helpers.arrayElement(BD_LOCATIONS);
            const user = new User({
                name: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: passwordHash,
                city: loc.div,
                phone: faker.string.numeric('017########'),
                address: faker.location.streetAddress()
            });
            usersToInsert.push(user);
        }
        await User.insertMany(usersToInsert.slice(1)); // 0 is already saved

        const savedUsers = await User.find({});
        console.log(`✅ ${savedUsers.length} users created`);

        console.log(`🟡 Generating ${NUM_BOOKS} Synthetic Books...`);
        const booksToInsert = [];

        for (let i = 0; i < NUM_BOOKS; i++) {
            const owner = faker.helpers.arrayElement(savedUsers);
            const category = faker.helpers.arrayElement(CATEGORIES);
            const hasHolder = faker.datatype.boolean({ probability: 0.6 }); // 60% of books are currently being read

            const book = new Book({
                title: faker.book.title(),
                titleBn: `${faker.word.adjective()} ${faker.word.noun()}`, // mock bengali
                author: faker.book.author(),
                category: category,
                tags: [faker.word.sample(), faker.word.sample(), category.toLowerCase()],
                cover_url: `https://picsum.photos/seed/${faker.string.uuid()}/300/450`,
                description: faker.lorem.paragraph(),
                owner_id: owner._id,
                available: !hasHolder,
                journey: [],
                waitlist: []
            });

            // If a book is travelling, assign it to a random user
            if (hasHolder) {
                const holder = faker.helpers.arrayElement(savedUsers);
                const loc = BD_LOCATIONS.find(l => l.div === holder.city) || BD_LOCATIONS[0];

                book.current_holder = {
                    user_id: holder._id,
                    name: holder.name,
                    city: holder.city,
                    location: { lat: jitter(loc.lat), lng: jitter(loc.lng) },
                    received_at: faker.date.recent({ days: 10 }),
                    due_at: faker.date.soon({ days: 7 })
                };

                // Add 1-4 past journey steps
                const numJumps = faker.number.int({ min: 1, max: 4 });
                for (let j = 0; j < numJumps; j++) {
                    const pastHolder = faker.helpers.arrayElement(savedUsers);
                    const pLoc = BD_LOCATIONS.find(l => l.div === pastHolder.city) || BD_LOCATIONS[0];
                    book.journey.push({
                        user_id: pastHolder._id,
                        name: pastHolder.name,
                        city: pastHolder.city,
                        location: { lat: jitter(pLoc.lat), lng: jitter(pLoc.lng) },
                        rating: faker.number.int({ min: 3, max: 5 }),
                        review: faker.lorem.sentence(),
                        from: faker.date.recent({ days: 60 }),
                        to: faker.date.recent({ days: 15 })
                    });
                }
            }

            // Maybe add some waitlist
            if (faker.datatype.boolean({ probability: 0.3 })) {
                const waiter = faker.helpers.arrayElement(savedUsers);
                const loc = BD_LOCATIONS.find(l => l.div === waiter.city) || BD_LOCATIONS[0];
                book.waitlist.push({
                    user_id: waiter._id,
                    name: waiter.name,
                    city: waiter.city,
                    location: { lat: jitter(loc.lat), lng: jitter(loc.lng) },
                    status: 'pending'
                });
            }

            booksToInsert.push(book);
        }

        await Book.insertMany(booksToInsert);
        console.log(`✅ ${booksToInsert.length} books created`);

        console.log('🎉 Database Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
