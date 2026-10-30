import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { FaCheck, FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        try {
            const res = await API.get("/booking/all");
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchBookings error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const approveBooking = async (id) => {
        try {
            await API.put(`/booking/approve/${id}`);
            alert("Booking has been APPROVED! ✅");
            fetchBookings();
        } catch (err) {
            console.log("approveBooking error:", err);
            alert("Failed to approve booking.");
        }
    };

    const rejectBooking = async (id) => {
        const confirmReject = window.confirm("Reject this booking?");
        if (!confirmReject) return;

        try {
            await API.put(`/booking/reject/${id}`);
            alert("Booking has been REJECTED ❌");
            fetchBookings();
        } catch (err) {
            console.log("rejectBooking error:", err);
            alert("Failed to reject booking.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8">
                    <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Reservations</span>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                        Manage Customer Bookings
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-orange-600 font-semibold">
                        Loading customer bookings...
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs uppercase font-extrabold tracking-wider">
                                    <tr>
                                        <th className="py-4 px-6">Parking Spot</th>
                                        <th className="py-4 px-6">Customer</th>
                                        <th className="py-4 px-6">Vehicle</th>
                                        <th className="py-4 px-6">Schedule</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-slate-400">
                                                No reservations placed yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((booking) => (
                                            <tr
                                                key={booking._id}
                                                className="hover:bg-orange-50/40 dark:hover:bg-slate-700/40 transition"
                                            >
                                                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                                                    {booking.parking?.name || "Deleted Parking"}
                                                    <span className="block text-xs font-normal text-slate-400">
                                                        {booking.parking?.city}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6">
                                                    <p className="font-semibold text-slate-800 dark:text-white">
                                                        {booking.user?.name || "Guest User"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {booking.user?.email || "No email"}
                                                    </p>
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className="font-mono font-bold text-slate-800 dark:text-white">
                                                        {booking.vehicleNumber}
                                                    </span>
                                                    <span className="block text-xs text-slate-400">
                                                        {booking.vehicleType}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <FaCalendarAlt className="text-orange-500" />
                                                        <span>{booking.entryDate} - {booking.exitDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                        <FaClock />
                                                        <span>{booking.entryTime} to {booking.exitTime} ({booking.totalHours} hrs)</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 font-black text-orange-600 dark:text-orange-400">
                                                    ₹{booking.totalAmount}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            booking.status === "Approved"
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                                : booking.status === "Rejected"
                                                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                                                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                                        }`}
                                                    >
                                                        {booking.status || "Pending"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    {booking.status === "Pending" ? (
                                                        <div className="flex justify-center items-center gap-2">
                                                            <button
                                                                onClick={() => approveBooking(booking._id)}
                                                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                                                            >
                                                                <FaCheck /> Approve
                                                            </button>

                                                            <button
                                                                onClick={() => rejectBooking(booking._id)}
                                                                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                                                            >
                                                                <FaTimes /> Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-semibold">Processed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ManageBookings;
