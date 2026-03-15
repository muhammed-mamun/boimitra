import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    🔐
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Login Required</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    You need to be logged in to request books, join waitlists, or manage your reading journey.
                </p>
                <div className="space-y-4">
                    <button className="btn bg-blue-600 hover:bg-blue-500 text-white w-full rounded-xl border-0">
                        Sign In / Register Placeholder
                    </button>
                    <Link to="/books" className="btn btn-ghost text-slate-400 hover:text-white w-full rounded-xl">
                        Cancel & Return to Books
                    </Link>
                </div>
            </div>
        </div>
    );
}
