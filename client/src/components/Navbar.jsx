import { Link, useNavigate } from "react-router-dom";
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

    const { darkMode, toggleTheme } = useTheme();

    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.clear();

        navigate("/login");

    };

    return (

        <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link
                    to="/"
                    className="text-3xl font-bold text-blue-600"
                >
                    ParkEase
                </Link>

                <div className="flex items-center gap-8">

                    <Link to="/">Home</Link>

                    <Link to="/my-bookings">

                        My Bookings

                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="text-xl"
                    >

                        {

                            darkMode ?

                                <FaSun />

                                :

                                <FaMoon />

                        }

                    </button>

                    {

                        user && (

                            <div className="relative">

                                <button

                                    onClick={() => setOpen(!open)}

                                    className="flex items-center gap-3"

                                >

                                    {

                                        user.image ?

                                            <img

                                                src={user.image}

                                                className="w-10 h-10 rounded-full object-cover"

                                            />

                                            :

                                            <FaUserCircle className="text-4xl text-blue-600" />

                                    }

                                    <span>

                                        {user.name}

                                    </span>

                                </button>

                                {

                                    open && (

                                        <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-xl">

                                            <Link

                                                to="/profile"

                                                className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700"

                                            >

                                                <FaUser />

                                                Profile

                                            </Link>


                                            <Link
                                                to="/help"
                                                className="flex items-center gap-3 p-4 hover:bg-gray-100   dark:hover:bg-gray-700"
                                            >
                                                <FaQuestionCircle />
                                                <span>Help Center</span>
                                            </Link>



                                            <Link

                                                to="/my-bookings"

                                                className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700"

                                            >

                                                <FaCar />

                                                My Bookings

                                            </Link>
                                            <Link
                                                to="/favorites"
                                                className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <FaHeart />
                                                <span>Favorites</span>
                                            </Link>

                                            {

                                                user.role === "admin" && (

                                                    <Link

                                                        to="/admin"

                                                        className="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700"

                                                    >

                                                        <FaTachometerAlt />

                                                        Admin Dashboard

                                                    </Link>

                                                )

                                            }

                                            <button

                                                onClick={logout}

                                                className="w-full flex items-center gap-3 p-4 hover:bg-red-500 hover:text-white"

                                            >

                                                <FaSignOutAlt />

                                                Logout

                                            </button>

                                        </div>

                                    )

                                }

                            </div>

                        )

                    }

                </div>

            </div>

        </nav>

    );

}

export default Navbar;