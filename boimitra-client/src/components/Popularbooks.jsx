import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';

export default function PopularBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2 inline-block">Explore Books</h2>
        <div className="h-1 w-20 bg-blue-500 rounded-full mb-8"></div>

        {loading ? (
          <div className="flex justify-center items-center py-20 mx-auto">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
          </div>
        ) : error ? (
          <div className="text-center py-10 mx-auto">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-10 mx-auto">
            <p className="text-slate-500 italic">No books currently available on the platform.</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Only show the first 4 books */}
              {books.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Show More Books Button */}
            <div className="flex justify-center mt-12">
              <Link to="/books" className="btn btn-outline btn-info rounded-full px-8 hover:!text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
                Show more books
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
