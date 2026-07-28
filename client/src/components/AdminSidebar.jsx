import { Link } from "react-router-dom";
import {
    FaHome,
    FaCar,
    FaClipboardList,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

function AdminSidebar() {

    return (

        <div className="w-64 bg-blue-700 text-white min-h-screen p-6">

            <h2 className="text-3xl font-bold mb-10">

                Admin

            </h2>

            <nav className="space-y-6">

                <Link
                    to="/admin"
                    className="flex items-center gap-3 hover:text-yellow-300"
                >
                    <FaHome />
                    Dashboard
                </Link>

                <Link
                    to="/admin/parking"
                    className="flex items-center gap-3 hover:text-yellow-300"
                >
                    <FaCar />
                    Manage Parking
                </Link>

                <Link
                    to="/admin/bookings"
                    className="flex items-center gap-3 hover:text-yellow-300"
                >
                    <FaClipboardList />
                    Bookings
                </Link>

                <Link
                    to="/admin/users"
                    className="flex items-center gap-3 hover:text-yellow-300"
                >
                    <FaUsers />
                    Users
                </Link>

                <Link
                    to="/login"
                    className="flex items-center gap-3 hover:text-red-300"
                >
                    <FaSignOutAlt />
                    Logout
                </Link>
                
            </nav>

        </div>

    );

}

export default AdminSidebar;