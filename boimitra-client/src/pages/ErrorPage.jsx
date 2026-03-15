import { Link, useRouteError } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';

export default function ErrorPage() {
    const error = useRouteError();
    const is404 = error?.status === 404;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
                <div className="p-6 rounded-full bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <FaBookOpen className="text-5xl text-slate-600" />
                </div>

                <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {is404 ? '404' : 'Oops!'}
                </h1>

                <p className="text-xl font-semibold text-white">
                    {is404 ? 'Page Not Found' : 'Something went wrong'}
                </p>

                <p className="text-slate-400 text-sm leading-relaxed">
                    {is404
                        ? "Looks like this page is on its own reading journey and hasn't come back yet."
                        : error?.statusText || error?.message || 'An unexpected error has occurred.'}
                </p>

                <Link
                    to="/"
                    className="btn rounded-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.35)]"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
