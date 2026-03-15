import { useState, useEffect } from 'react';
import { FaBookOpen, FaSearch, FaTimes } from 'react-icons/fa';
import BookCard from '../components/BookCard';

const CATEGORIES = [
    "All", "Fiction", "Poetry", "History", "Biography",
    "Philosophy", "Religion", "Science", "Self-Help",
    "Travel", "Classic", "Mystery", "Romance"
];

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/books');
                if (!response.ok) throw new Error('Failed to fetch books');
                const data = await response.json();
                setBooks(data);
                setFiltered(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Apply filters whenever category or search changes
    useEffect(() => {
        let result = [...books];
        if (activeCategory !== 'All') {
            result = result.filter(b => b.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title?.toLowerCase().includes(q) ||
                b.titleBn?.toLowerCase().includes(q) ||
                b.author?.toLowerCase().includes(q) ||
                b.tags?.some(t => t.toLowerCase().includes(q))
            );
        }
        setFiltered(result);
    }, [activeCategory, searchQuery, books]);

    return (
        <div className="min-h-screen bg-slate-950">

            {/* Page Header */}
            <div className="bg-slate-900 border-b border-slate-800 py-10 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-white mb-1">Book Library</h1>
                    <div className="h-1 w-16 bg-blue-500 rounded-full mb-4"></div>
                    <p className="text-slate-400 text-base max-w-xl">
                        Browse all available books. Request one, read it for 7 days, and pass it on to the next reader across Bangladesh.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                {/* Search Bar */}
                <div className="relative mb-8 max-w-lg">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author, or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full bg-slate-900 border-slate-700 text-white placeholder-slate-500 pl-11 pr-10 focus:border-blue-500 focus:outline-none rounded-full"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 md:px-5 md:py-2 cursor-pointer rounded-full text-sm font-medium border transition-all duration-200 ${activeCategory === cat
                                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                {!loading && !error && (
                    <p className="text-slate-500 text-sm mb-6">
                        Showing <span className="text-blue-400 font-semibold">{filtered.length}</span> book{filtered.length !== 1 ? 's' : ''}
                        {activeCategory !== 'All' && <span> in <span className="text-white">{activeCategory}</span></span>}
                        {searchQuery && <span> matching "<span className="text-white">{searchQuery}</span>"</span>}
                    </p>
                )}

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <span className="loading loading-spinner loading-lg text-blue-500"></span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400">Error: {error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 flex flex-col items-center gap-4">
                        <FaBookOpen className="text-5xl text-slate-700" />
                        <p className="text-slate-500 text-lg">No books found matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="btn btn-outline btn-sm rounded-full border-slate-600 text-slate-300"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-6">
                        {filtered.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
