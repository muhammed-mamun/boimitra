require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const connectDB = require('../config/db');

// Mix of Bengali and International books mapped to our frontend Categories
const seedBooks = [
    {
        title: "Pather Panchali",
        titleBn: "পথের পাঁচালী",
        author: "Bibhutibhushan Bandyopadhyay",
        category: "Classic",
        tags: ["bengali", "classic", "village", "childhood"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Pather_Panchali.jpg/220px-Pather_Panchali.jpg",
        description: "A timeless classic portraying the life of a poor Brahmin family in a rural Bengali village, focusing on the childhood of Apu and his sister Durga."
    },
    {
        title: "One Hundred Years of Solitude",
        titleBn: "নিঃসঙ্গতার একশ বছর",
        author: "Gabriel García Márquez",
        category: "Fiction",
        tags: ["magical realism", "international", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/a/a0/Cien_a%C3%B1os_de_soledad_%28book_cover%2C_1967%29.jpg",
        description: "The story of the Buendía family, whose patriarch, José Arcadio Buendía, founded the fictitious town of Macondo."
    },
    {
        title: "Shesher Kabita",
        titleBn: "শেষের কবিতা",
        author: "Rabindranath Tagore",
        category: "Romance",
        tags: ["bengali", "classic", "poetry", "romance"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/thumb/6/6f/Shesher_Kabita.jpg/220px-Shesher_Kabita.jpg",
        description: "A novel by Rabindranath Tagore, considered a landmark in Bengali literature, exploring love, intellect, and societal norms."
    },
    {
        title: "The Alchemist",
        titleBn: "দ্য অ্যালকেমিস্ট",
        author: "Paulo Coelho",
        category: "Philosophy",
        tags: ["adventure", "international", "spiritual"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/c/c4/TheAlchemist.jpg",
        description: "A young Andalusian shepherd travels to the pyramids of Egypt to find a treasure he has recurrently dreamed about."
    },
    {
        title: "Gitanjali",
        titleBn: "গীতাঞ্জলি",
        author: "Rabindranath Tagore",
        category: "Poetry",
        tags: ["bengali", "nobel", "spiritual", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gitanjali_%281st_ed%29.jpg/220px-Gitanjali_%281st_ed%29.jpg",
        description: "A collection of poems by Rabindranath Tagore, for which he won the Nobel Prize in Literature."
    },
    {
        title: "The Kite Runner",
        titleBn: "দ্য কাইট রানার",
        author: "Khaled Hosseini",
        category: "Fiction",
        tags: ["international", "drama", "friendship"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/6/62/Kite_runner.jpg",
        description: "An emotional story of friendship, betrayal, and redemption set against the backdrop of a changing Afghanistan."
    },
    {
        title: "A Brief History of Time",
        titleBn: "কালের সংক্ষিপ্ত ইতিহাস",
        author: "Stephen Hawking",
        category: "Science",
        tags: ["physics", "cosmos", "international", "non-fiction"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/a/a3/BriefHistoryTime.jpg",
        description: "A landmark volume in science writing by one of the great minds of our time, exploring cosmology, the Big Bang, and black holes."
    },
    {
        title: "Devdas",
        titleBn: "দেবদাস",
        author: "Sarat Chandra Chattopadhyay",
        category: "Romance",
        tags: ["bengali", "classic", "tragedy"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/d/db/Devdas_%28novell%29.jpg",
        description: "A classic Bengali romance novel about the tragic love story of Devdas and Parvati."
    },
    {
        title: "Atomic Habits",
        titleBn: "অ্যাটমিক হ্যাবিটস",
        author: "James Clear",
        category: "Self-Help",
        tags: ["productivity", "psychology", "international"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Atomic_Habits.jpg/220px-Atomic_Habits.jpg",
        description: "An easy and proven way to build good habits and break bad ones."
    },
    {
        title: "Gora",
        titleBn: "গোরা",
        author: "Rabindranath Tagore",
        category: "Fiction",
        tags: ["bengali", "classic", "politics", "religion"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/thumb/8/82/Gora_Book_Cover.jpg/220px-Gora_Book_Cover.jpg",
        description: "Tagore's longest novel, exploring themes of nationalism, religion, and identity in colonial India."
    },
    {
        title: "Sapiens: A Brief History of Humankind",
        titleBn: "স্যাপিয়েন্স",
        author: "Yuval Noah Harari",
        category: "History",
        tags: ["anthropology", "evolution", "international"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/0/06/%E1%B8%B2itsur_toldot_ha-enoshut.jpg",
        description: "Explores the history of the human species, from the emergence of Homo sapiens to the 21st century."
    },
    {
        title: "Byomkesh Bakshi",
        titleBn: "ব্যোমকেশ বক্সী",
        author: "Sharadindu Bandyopadhyay",
        category: "Mystery",
        tags: ["bengali", "detective", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/0/05/Byomkesh_Samagra_Cover.jpg",
        description: "The thrilling investigative adventures of the famous Bengali 'truth-seeker' Byomkesh Bakshi."
    },
    {
        title: "The Diary of a Young Girl",
        titleBn: "অ্যান ফ্রাঙ্কের ডায়েরি",
        author: "Anne Frank",
        category: "Biography",
        tags: ["holocaust", "history", "international", "memoir"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/4/47/Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg",
        description: "The poignant and powerful diary of a Jewish girl hiding from the Nazis during World War II."
    },
    {
        title: "Abol Tabol",
        titleBn: "আবোল তাবোল",
        author: "Sukumar Ray",
        category: "Poetry",
        tags: ["bengali", "nonsense rhythm", "children", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/3/3b/Aboltabol_first_edition_Cover.jpg",
        description: "A famous collection of Bengali nonsense rhymes and poetry for children and adults alike."
    },
    {
        title: "To Kill a Mockingbird",
        titleBn: "টু কিল আ মকিংবার্ড",
        author: "Harper Lee",
        category: "Classic",
        tags: ["international", "racism", "justice"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/7/79/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
        description: "A profound novel addressing serious issues of racial inequality and rape in the American South."
    },
    {
        title: "Chander Pahar",
        titleBn: "চাঁদের পাহাড়",
        author: "Bibhutibhushan Bandyopadhyay",
        category: "Travel",
        tags: ["bengali", "adventure", "africa", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Chander_Pahar_Book_Cover.jpg/220px-Chander_Pahar_Book_Cover.jpg",
        description: "An epic adventure novel about a young Bengali man exploring the uncharted wilderness of Africa."
    },
    {
        title: "Man's Search for Meaning",
        titleBn: "মানুষের অর্থ সন্ধান",
        author: "Viktor E. Frankl",
        category: "Philosophy",
        tags: ["psychology", "holocaust", "international"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/b/b5/Mans_Search_for_Meaning.jpg",
        description: "Psychiatrist Viktor Frankl's memoir of life in Nazi death camps and its lessons for spiritual survival."
    },
    {
        title: "Aranyak",
        titleBn: "আরণ্যক",
        author: "Bibhutibhushan Bandyopadhyay",
        category: "Fiction",
        tags: ["bengali", "nature", "forest", "classic"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/d/d4/Aranyak.jpg",
        description: "A semi-autobiographical novel capturing the mesmerizing beauty and harsh realities of the Bihar forests."
    },
    {
        title: "Thinking, Fast and Slow",
        titleBn: "থিংকিং, ফাস্ট অ্যান্ড স্লো",
        author: "Daniel Kahneman",
        category: "Science",
        tags: ["psychology", "economics", "international"],
        cover_url: "https://upload.wikimedia.org/wikipedia/en/c/c1/Thinking%2C_Fast_and_Slow.png",
        description: "A groundbreaking tour of the mind explaining the two systems that drive the way we think."
    },
    {
        title: "Feluda Samagra",
        titleBn: "ফেলুদা সমগ্র",
        author: "Satyajit Ray",
        category: "Mystery",
        tags: ["bengali", "detective", "adventure"],
        cover_url: "https://upload.wikimedia.org/wikipedia/bn/4/4b/Feluda_Logo.jpg",
        description: "The complete collection of adventurous investigations by the iconic Bengali detective Feluda."
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Optional: Clear existing books if you want a fresh start
        // await Book.deleteMany();
        // console.log('Previous books wiped.');

        console.log(`Attempting to seed ${seedBooks.length} books...`);

        for (const bookData of seedBooks) {
            // Just mock some default tracking logic so they show up as 'available'
            const newBook = new Book({
                ...bookData,
                available: true,
                journey: [],
                waitlist: []
            });
            await newBook.save();
        }

        console.log('Database successfully seeded with 20 books!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
