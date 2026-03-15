import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { FaHistory, FaListUl, FaUserShield } from 'react-icons/fa';

export default function DashboardPage() {
    const { user, token, loading: authLoading } = useAuth();

    const [history, setHistory] = useState([]);
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('queue');

    useEffect(() => {
        // Wait for auth to resolve before fetching
        if (authLoading) return;
        // If not authenticated, we let the redirect handle it
        if (!user) return;

        const fetchDashboardData = async () => {
            try {
                // Fetch both concurrently for speed
                const [historyRes, queueRes] = await Promise.all([
                    fetch('http://localhost:5000/api/users/me/history', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/users/me/queue', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!historyRes.ok || !queueRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const historyData = await historyRes.json();
                const queueData = await queueRes.json();

                setHistory(historyData);
                setQueue(queueData);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, token, authLoading]);

    // Protect route: Redirect if not logged in
    if (!authLoading && !user) {
        return <Navigate to="/login" replace />;
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <span className="loading loading-spinner text-blue-500 loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl max-w-md text-center">
                    <p className="font-bold text-lg mb-2">Error Loading Dashboard</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Premium Header Profile Section */}
            <div className="bg-slate-900 border-b border-slate-800 pt-10 pb-8 px-4 mb-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl text-white font-bold shadow-xl shadow-blue-500/20 border-2 border-slate-700 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{user.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="badge badge-lg bg-slate-800 text-slate-300 border-slate-700">📍 {user.city}</span>
                            <span className="badge badge-lg bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold">
                                📚 {history.length} Books Read
                            </span>
                            <span className="badge badge-lg bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold">
                                ⏳ {queue.length} in Queue
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('queue')}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'queue' ? 'text-white border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                    >
                        <FaListUl className={activeTab === 'queue' ? 'text-blue-500' : 'text-slate-600'} />
                        My Waitlist Queue
                        <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full ml-1">{queue.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'history' ? 'text-white border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                    >
                        <FaHistory className={activeTab === 'history' ? 'text-blue-500' : 'text-slate-600'} />
                        Reading History
                        <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full ml-1">{history.length}</span>
                    </button>
                    {/* Placeholder for future features */}
                    <button className="flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 border-transparent text-slate-600 opacity-50 cursor-not-allowed whitespace-nowrap">
                        <FaUserShield /> My Shared Books (Soon)
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'queue' && (
                        <div>
                            {queue.length === 0 ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                                    <div className="text-5xl mb-4 opacity-50">📭</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Your queue is empty</h3>
                                    <p className="text-slate-400 mb-6">Find a book you'd like to read and join the waitlist.</p>
                                    <Link to="/books" className="btn bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 border-0">
                                        Browse Library
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {queue.map(book => <BookCard key={book._id} book={book} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            {history.length === 0 ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                                    <div className="text-5xl mb-4 opacity-50">📖</div>
                                    <h3 className="text-xl font-bold text-white mb-2">No reading history yet</h3>
                                    <p className="text-slate-400 mb-6">Books you read and handover will appear here as part of your journey.</p>
                                    <Link to="/books" className="btn btn-outline border-slate-700 text-slate-300 hover:text-white rounded-full px-8">
                                        Explore Books
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {history.map(book => <BookCard key={book._id} book={book} />)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
