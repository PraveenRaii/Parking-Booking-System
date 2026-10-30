import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaCar,
    FaClipboardList,
    FaUsers,
    FaSignOutAlt,
    FaArrowLeft,
    FaPlusCircle
} from "react-icons/fa";

function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const links = [
        { path: "/admin", name: "Dashboard", icon: <FaHome /> },
        { path: "/admin/parking", name: "Manage Parking", icon: <FaCar /> },
        { path: "/admin/add-parking", name: "Add Parking", icon: <FaPlusCircle /> },
        { path: "/admin/bookings", name: "Manage Bookings", icon: <FaClipboardList /> },
        { path: "/admin/users", name: "Manage Users", icon: <FaUsers /> },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-6 flex flex-col justify-between border-r border-slate-800 shadow-xl shrink-0">
            <div>
                <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-800">
                    <span className="p-2.5 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md shadow-orange-500/20">
                        <FaCar className="text-xl" />
                    </span>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">ParkEase</h2>
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Admin Portal</span>
                    </div>
                </div>

                <nav className="space-y-2">
                    {links.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                                    active
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                }`}
                            >
                                <span className={`text-base ${active ? "text-white" : "text-orange-400"}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-2">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-orange-400 hover:bg-slate-800/60 text-sm font-semibold transition"
                >
                    <FaArrowLeft />
                    <span>Back to Website</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 text-sm font-semibold transition"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;
