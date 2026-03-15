import React from "react";
import { FaArrowRight, FaMapMarkedAlt, FaBookOpen, FaRoute } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-950 min-h-[80vh] flex flex-col justify-center">
      {/* Background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-700/15 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-700/15 blur-3xl animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">

          <div className="mb-6">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wider mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              THE BOOK JOURNEY EXPERIMENT
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                বইমিত্র
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-slate-400 mt-4">
              Books don't belong on shelves.<br className="hidden md:block" /> They belong in <span className="text-blue-400">hands</span>.
            </p>
          </div>

          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Borrow a physical book for 7 days. Once you finish, leave your mark and pass it to the next reader. Watch books travel across Bangladesh in real-time.
          </p>

          {/* Gamification Stats Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10 mb-12">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                <FaBookOpen className="text-xl" />
              </div>
              <span className="font-medium text-left leading-tight text-slate-300">Read for<br />7 Days</span>
            </div>

            <div className="hidden sm:block w-12 h-px bg-slate-800"></div>

            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <FaRoute className="text-xl" />
              </div>
              <span className="font-medium text-left leading-tight text-slate-300">Pass to<br />Next Reader</span>
            </div>

            <div className="hidden sm:block w-12 h-px bg-slate-800"></div>

            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <FaMapMarkedAlt className="text-xl" />
              </div>
              <span className="font-medium text-left leading-tight text-slate-300">Track on<br />Live Map</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              to="/books"
              className="group px-8 py-4 font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:shadow-[0_0_35px_rgba(79,70,229,0.55)] transform hover:-translate-y-1 flex items-center gap-2"
            >
              Start Your Journey
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
