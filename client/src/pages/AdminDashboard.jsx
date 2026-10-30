import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import DashboardCard from "../components/DashboardCard";
import { FaUsers, FaCar, FaClipboardList, FaRupeeSign, FaCheckCircle, FaCarSide } from "react-icons/fa";

function AdminDashboard() {
    const [data, setData] = useState({
        totalUsers: 0,
        totalParking: 0,
        totalBookings: 0,
        revenue: 0,
        availableSlots: 0,
        occupiedSlots: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await API.get("/dashboard");
            setData(res.data || {});
        } catch (err) {
            console.log("fetchDashboard error:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Overview</span>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            Admin Analytics Dashboard
                        </h1>
                    </div>

                    <Link
                        to="/admin/add-parking"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition text-sm flex items-center gap-2"
                    >
                        <span>+ Add New Parking</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-orange-600 font-semibold">
                        Loading dashboard metrics...
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link to="/admin/users" className="block">
                                <DashboardCard
                                    title="Total Users"
                                    value={data.totalUsers}
                                    icon={<FaUsers className="text-2xl" />}
                                    color="bg-orange-500"
                                />
                            </Link>

                            <Link to="/admin/parking" className="block">
                                <DashboardCard
                                    title="Active Parking Spaces"
                                    value={data.totalParking}
                                    icon={<FaCar className="text-2xl" />}
                                    color="bg-amber-500"
                                />
                            </Link>

                            <Link to="/admin/bookings" className="block">
                                <DashboardCard
                                    title="Total Bookings"
                                    value={data.totalBookings}
                                    icon={<FaClipboardList className="text-2xl" />}
                                    color="bg-orange-600"
                                />
                            </Link>

                            <DashboardCard
                                title="Approved Revenue"
                                value={`₹${data.revenue || 0}`}
                                icon={<FaRupeeSign className="text-2xl" />}
                                color="bg-emerald-600"
                            />

                            <DashboardCard
                                title="Available Free Slots"
                                value={data.availableSlots || 0}
                                icon={<FaCheckCircle className="text-2xl" />}
                                color="bg-teal-600"
                            />

                            <DashboardCard
                                title="Occupied Slots"
                                value={data.occupiedSlots || 0}
                                icon={<FaCarSide className="text-2xl" />}
                                color="bg-slate-700"
                            />
                        </div>

                        {/* Quick Action Navigation Grid */}
                        <div className="mt-10 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-orange-100 dark:border-slate-700 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                Quick Management Portals
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                <Link
                                    to="/admin/parking"
                                    className="p-5 rounded-2xl bg-orange-50/60 dark:bg-slate-700/50 border border-orange-200/60 dark:border-slate-600 hover:border-orange-500 transition group"
                                >
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-orange-600">
                                        Manage Parking Spots →
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Edit pricing, total slots, addresses, and images.</p>
                                </Link>

                                <Link
                                    to="/admin/bookings"
                                    className="p-5 rounded-2xl bg-orange-50/60 dark:bg-slate-700/50 border border-orange-200/60 dark:border-slate-600 hover:border-orange-500 transition group"
                                >
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-orange-600">
                                        Manage Reservations →
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Approve or reject real-time user bookings.</p>
                                </Link>

                                <Link
                                    to="/admin/users"
                                    className="p-5 rounded-2xl bg-orange-50/60 dark:bg-slate-700/50 border border-orange-200/60 dark:border-slate-600 hover:border-orange-500 transition group"
                                >
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-orange-600">
                                        User Accounts →
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">View registered customers and permissions.</p>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;
