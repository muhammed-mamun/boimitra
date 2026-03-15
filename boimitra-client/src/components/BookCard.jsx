import { FaBookOpen, FaUserClock, FaMapMarkerAlt } from 'react-icons/fa';

import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
    return (
        <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="card bg-slate-900 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-300 block"
        >
            <figure className="relative h-64 bg-slate-800 w-full overflow-hidden">
                {book.cover_url ? (
                    <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FaBookOpen className="text-4xl text-slate-600" />
                )}

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                    {book.available ? (
                        <div className="badge badge-success text-white text-xs font-bold border-none shadow-md">
                            Available
                        </div>
                    ) : (
                        <div className="badge badge-warning text-slate-900 text-xs font-bold border-none shadow-md gap-1">
                            <FaUserClock /> Active
                        </div>
                    )}
                </div>
            </figure>

            <div className="card-body p-5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-outline badge-info badge-sm text-[10px] font-bold tracking-wider uppercase">
                        {book.category || 'General'}
                    </span>
                </div>

                <h2 className="card-title text-lg font-bold text-white line-clamp-1 hover:text-blue-400 transition-colors cursor-pointer">
                    {book.title}
                </h2>

                {book.titleBn && (
                    <p className="text-sm text-slate-400 font-bengali line-clamp-1 m-0">
                        {book.titleBn}
                    </p>
                )}

                <p className="text-sm text-slate-500 mt-1 mb-2">
                    by <span className="text-slate-300">{book.author}</span>
                </p>

                {/* Gamification Stats Footer */}
                <div className="card-actions justify-between mt-auto pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FaMapMarkerAlt className="text-indigo-400" />
                        <span>{book.journey ? book.journey.length : 0} Readers</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <FaUserClock className="text-blue-400" />
                        <span>{book.waitlist ? book.waitlist.length : 0} Waiting</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}