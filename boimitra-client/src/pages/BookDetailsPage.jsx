import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaUserClock, FaBookOpen } from 'react-icons/fa';
import JourneyMap from '../components/JourneyMap';
import { useAuth } from '../context/AuthContext';

export default function BookDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const fetchBookDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`);
            if (!response.ok) throw new Error('Book not found');
            const data = await response.json();
            setBook(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const handleActionClick = async () => {
        if (!user) {
            // Include current path so login can route back
            navigate('/login', { state: { from: location } });
            return;
        }

        setActionLoading(true);
        setActionMessage(null);
        try {
            const res = await fetch(`http://localhost:5000/api/books/${id}/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Action failed');

            // Re-fetch book to instantly show updated queue
            await fetchBookDetails();

            setActionMessage({ type: 'success', text: data.message });
            setTimeout(() => setActionMessage(null), 3000);

        } catch (err) {
            setActionMessage({ type: 'error', text: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <span className="loading loading-spinner text-blue-500 loading-lg"></span>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-4">📚</div>
                <h1 className="text-2xl font-bold text-white mb-2">Oops! Book Not Found</h1>
                <p className="text-slate-400 mb-6 font-medium">{error}</p>
                <Link to="/books" className="btn bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-full px-8">
                    <FaArrowLeft className="mr-2" /> Back to Library
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <Link to="/books" className="btn btn-ghost text-slate-400 hover:text-white mb-6">
                    <FaArrowLeft /> Back to Books
                </Link>

                {/* Hero / Details Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row gap-8 lg:gap-14 mb-8">
                    {/* Cover Image */}
                    <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                        <div className="aspect-[2/3] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                            {book.cover_url ? (
                                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaBookOpen className="text-6xl text-slate-600" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="badge badge-info bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-3 font-bold uppercase tracking-wider text-xs">
                                {book.category || 'General'}
                            </span>
                            {book.available ? (
                                <div className="badge badge-success bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-3 font-bold text-xs">
                                    Available Now
                                </div>
                            ) : (
                                <div className="badge badge-warning bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-3 font-bold gap-1.5 text-xs">
                                    <FaUserClock /> Currently Reading
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                            {book.title}
                        </h1>
                        {book.titleBn && (
                            <h2 className="text-xl md:text-2xl text-slate-400 font-bengali mb-4 font-medium">
                                {book.titleBn}
                            </h2>
                        )}

                        <p className="text-lg text-slate-300 mb-6">
                            <span className="font-bold text-white border-b-2 border-slate-700 pb-0.5">{book.author}</span>
                        </p>

                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                                <span className="font-bold">{book.journey ? book.journey.length : 0}</span>
                                <span className="text-sm">people read this book</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                <span className="font-bold">{book.waitlist ? book.waitlist.length : 0}</span>
                                <span className="text-sm">people are waiting</span>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-slate max-w-none mb-8 line-clamp-4">
                            <p className="text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 italic">
                                "{book.description || 'No description provided.'}"
                            </p>
                        </div>

                        {actionMessage && (
                            <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${actionMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                {actionMessage.text}
                            </div>
                        )}

                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleActionClick}
                                disabled={actionLoading}
                                className="btn bg-blue-600 hover:bg-blue-500 text-white rounded-full border-0 px-8 disabled:opacity-50"
                            >
                                {actionLoading ? <span className="loading loading-spinner"></span> : (book.available ? 'Request to Read' : 'Join Waitlist')}
                            </button>
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className={`btn rounded-full px-8 transition-colors ${showMap ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 border-amber-500' : 'btn-outline border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'}`}
                            >
                                <FaMapMarkerAlt className={showMap ? 'text-slate-900' : 'text-amber-500'} />
                                {showMap ? 'Hide Journey Map' : 'View Journey Map'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dynamic Contextual Map Section */}
                {showMap && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">🗺️</span> Book Journey History
                        </h3>
                        <JourneyMap bookContext={book} />
                    </div>
                )}
            </div>
        </div>
    );
}
