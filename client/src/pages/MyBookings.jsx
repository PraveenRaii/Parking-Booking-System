import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaCar, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBookings = useCallback(async () => {
        try {
            const res = await API.get("/booking");
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchBookings error:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const getStatusBadge = (status) => {
        if (status === "Approved") {
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full text-xs font-bold">
                    <FaCheckCircle /> Approved
                </span>
            );
        }
        if (status === "Rejected") {
            return (
                <span className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-full text-xs font-bold">
                    <FaTimesCircle /> Rejected
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 rounded-full text-xs font-bold">
                <FaHourglassHalf /> Pending
            </span>
        );
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Reservations</span>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-1">
                            🚗 My Bookings
                        </h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-orange-600 font-semibold">
                            Loading your bookings...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-orange-200 dark:border-slate-700 max-w-lg mx-auto">
                            <span className="text-5xl">🎟️</span>
                            <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">No Bookings Found</h2>
                            <p className="text-slate-500 text-sm mt-2">
                                You haven't booked any parking slots yet. Search nearby parking spaces and reserve a spot in seconds!
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 transition"
                            >
                                Book Parking Now
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-white dark:bg-slate-800 shadow-md border border-orange-100 dark:border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition"
                                >
                                    <div>
                                        <div className="flex justify-between items-start gap-3">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                                {booking.parking?.name || "Parking Location"}
                                            </h2>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Booking ID: #{booking._id.slice(-6).toUpperCase()}
                                        </p>

                                        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <FaCar className="text-orange-500 shrink-0" />
                                                <span>Vehicle: <strong className="text-slate-800 dark:text-white">{booking.vehicleNumber}</strong> ({booking.vehicleType})</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-orange-500 shrink-0" />
                                                <span>Entry: {booking.entryDate} at {booking.entryTime}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-orange-500 shrink-0" />
                                                <span>Exit: {booking.exitDate} at {booking.exitTime}</span>
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Duration: {booking.totalHours} hours
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs text-slate-400 block">Total Paid</span>
                                            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                                                ₹{booking.totalAmount}
                                            </span>
                                        </div>

                                        {booking.parking?._id && (
                                            <button
                                                onClick={() => navigate(`/parking/${booking.parking._id}`)}
                                                className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                                            >
                                                View Spot Details →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyBookings;
