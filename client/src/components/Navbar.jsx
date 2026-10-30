import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

import {
    FaUserCircle,
    FaSignOutAlt,
    FaUser,
    FaCar,
    FaMoon,
    FaHeart,
    FaQuestionCircle,
    FaSun,
    FaTachometerAlt
} from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);

    let user = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored) user = JSON.parse(stored);
    } catch {
        user = null;
    }

    const logout = () => {
        localStorage.clear();
        setOpen(false);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-black text-orange-600 dark:text-orange-500 tracking-tight hover:opacity-90 transition"
                >
                    <span className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md shadow-orange-500/20">
                        <FaCar className="text-xl" />
                    </span>
                    <span>Park<span className="text-slate-900 dark:text-white">Ease</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className={`text-sm font-semibold transition ${
                            isActive("/")
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/my-bookings"
                        className={`text-sm font-semibold transition ${
                            isActive("/my-bookings")
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                    >
                        My Bookings
                    </Link>

                    <Link
                        to="/favorites"
                        className={`text-sm font-semibold transition ${
                            isActive("/favorites")
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                    >
                        Favorites
                    </Link>

                    <Link
                        to="/help"
                        className={`text-sm font-semibold transition ${
                            isActive("/help")
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
                        }`}
                    >
                        AI Help
                    </Link>

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition"
                    >
                        {darkMode ? <FaSun className="text-lg text-amber-400" /> : <FaMoon className="text-lg" />}
                    </button>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-orange-400 transition"
                            >
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500"
                                    />
                                ) : (
                                    <FaUserCircle className="text-3xl text-orange-500" />
                                )}
                                <span className="font-semibold text-sm max-w-[120px] truncate text-slate-800 dark:text-slate-100">
                                    {user.name}
                                </span>
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Signed in as</p>
                                        <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50 hover:text-orange-600 transition"
                                    >
                                        <FaUser className="text-orange-500" />
                                        Profile
                                    </Link>

                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50 hover:text-orange-600 transition"
                                    >
                                        <FaCar className="text-orange-500" />
                                        My Bookings
                                    </Link>

                                    <Link
                                        to="/favorites"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50 hover:text-orange-600 transition"
                                    >
                                        <FaHeart className="text-orange-500" />
                                        Favorites
                                    </Link>

                                    <Link
                                        to="/help"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/50 hover:text-orange-600 transition"
                                    >
                                        <FaQuestionCircle className="text-orange-500" />
                                        Help Center
                                    </Link>

                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-slate-700/50 transition border-t border-slate-100 dark:border-slate-700"
                                        >
                                            <FaTachometerAlt />
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition border-t border-slate-100 dark:border-slate-700 mt-1"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
