import { FaGithub, FaMapMarkerAlt, FaBookOpen, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-10 px-4 md:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                        বইমিত্র
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        A physical book sharing community for Bangladeshi readers. Read it, review it, pass it on.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navigate</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link to="/books" className="hover:text-blue-400 transition-colors">Browse Books</Link></li>
                    </ul>
                </div>

                {/* Features */}
                <div>
                    <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">The Journey</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li className="flex items-center gap-2"><FaBookOpen className="text-blue-400 shrink-0" /> Read for 7 days</li>
                        <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400 shrink-0" /> Track on Bangladesh map</li>
                        <li className="flex items-center gap-2"><FaHeart className="text-pink-400 shrink-0" /> Leave your review</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
                <p>© {new Date().getFullYear()} বইমিত্র — Boimitra. All rights reserved.</p>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
                >
                    <FaGithub /> GitHub
                </a>
            </div>
        </footer>
    );
}
