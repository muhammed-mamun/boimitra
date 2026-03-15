import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="navbar bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 px-4 border-b border-slate-800/80 text-slate-200">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost text-slate-300 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {/* Mobile dropdown */}
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-slate-950 border border-slate-800 rounded-box z-50 mt-3 w-52 p-2 shadow-xl shadow-black/60 text-slate-200">
            <li><Link to="/" className="hover:bg-slate-800 hover:text-white">Home</Link></li>
            <li><Link to="/books" className="hover:bg-slate-800 hover:text-white">Books</Link></li>
            <li><Link to="/" className="hover:bg-slate-800 hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 ml-2">
          বইমিত্র
        </Link>
      </div>

      {/* Desktop nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-slate-400 text-sm font-medium gap-1">
          <li>
            <Link to="/" className="hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/books" className="hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Books</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Blog</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <Link to="/" className="btn btn-sm md:btn-md btn-outline border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 hover:border-white rounded-full px-6 md:px-8 transition-all">
          Login
        </Link>
      </div>
    </div>
  );
}
