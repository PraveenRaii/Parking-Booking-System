import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaCar, FaClock, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

function Booking() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const parking = state?.parking;
    const [loading, setLoading] = useState(false);

    // Default entry to today and next hour
    const today = new Date().toISOString().split("T")[0];
    const [booking, setBooking] = useState({
        vehicleType: "Car",
        vehicleNumber: "",
        entryDate: today,
        entryTime: "10:00",
        exitDate: today,
        exitTime: "12:00"
    });

    const [totalHours, setTotalHours] = useState(2);
    const [totalAmount, setTotalAmount] = useState((parking?.price || 50) * 2);

    const calculatePrice = useCallback(() => {
        if (!booking.entryDate || !booking.entryTime || !booking.exitDate || !booking.exitTime) {
            return;
        }

        const entry = new Date(`${booking.entryDate}T${booking.entryTime}`);
        const exit = new Date(`${booking.exitDate}T${booking.exitTime}`);

        if (exit <= entry) {
            setTotalHours(0);
            setTotalAmount(0);
            return;
        }

        const diff = exit - entry;
        const hours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
        setTotalHours(hours);
        setTotalAmount(hours * (parking?.price || 0));
    }, [booking.entryDate, booking.entryTime, booking.exitDate, booking.exitTime, parking?.price]);

    useEffect(() => {
        calculatePrice();
    }, [calculatePrice]);

    const handleChange = (e) => {
        setBooking((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (loading) return;

        const token = localStorage.getItem("token");
        if (!token || token === "null" || token === "undefined") {
            alert("Please log in first to complete your reservation.");
            navigate("/login", { state: { returnUrl: "/booking", parking } });
            return;
        }

        if (!booking.vehicleNumber.trim()) {
            alert("Please enter your vehicle registration number.");
            return;
        }

        if (totalHours <= 0 || totalAmount <= 0) {
            alert("Exit time must be later than entry time.");
            return;
        }

        try {
            setLoading(true);
            const data = {
                parking: parking._id,
                vehicleNumber: booking.vehicleNumber.toUpperCase().trim(),
                vehicleType: booking.vehicleType,
                entryDate: booking.entryDate,
                entryTime: booking.entryTime,
                exitDate: booking.exitDate,
                exitTime: booking.exitTime,
                totalHours: totalHours,
                totalAmount: totalAmount
            };

            const res = await API.post("/booking", data);

            navigate("/payment", {
                state: {
                    booking: res.data.booking || {
                        ...data,
                        _id: res.data.booking?._id || "NEW"
                    }
                }
            });
        } catch (err) {
            console.log("handleBooking error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Your session has expired. Please log in again to continue.");
                navigate("/login", { state: { returnUrl: "/booking", parking } });
                return;
            }
            alert(err.response?.data?.message || "Booking submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (!parking) {
        return (
            <>
                <Navbar />
                <div className="max-w-md mx-auto text-center py-20 px-6">
                    <span className="text-5xl">🚗</span>
                    <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">No Parking Selected</h2>
                    <p className="text-slate-500 text-sm mt-2">Please select a parking spot from the home page to book a slot.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
                    >
                        Browse Parking
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Step 1 of 2</span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1">
                            Reserve Parking Slot
                        </h1>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Form */}
                        <div className="md:col-span-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 p-8">
                            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-2xl">
                                    <FaCar className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{parking.name}</h2>
                                    <p className="text-xs text-slate-400">{parking.city} • ₹{parking.price}/hr</p>
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Vehicle Number
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        placeholder="e.g. DL 01 AB 1234"
                                        value={booking.vehicleNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl uppercase font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Vehicle Type
                                    </label>
                                    <select
                                        name="vehicleType"
                                        value={booking.vehicleType}
                                        onChange={handleChange}
                                        className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                                    >
                                        <option value="Car">Car / Sedan / SUV</option>
                                        <option value="Bike">Motorcycle / Scooter</option>
                                        <option value="EV">Electric Vehicle (EV)</option>
                                        <option value="Bus">Bus / Large Vehicle</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                            <FaCalendarAlt className="text-orange-500" /> Entry Date
                                        </label>
                                        <input
                                            type="date"
                                            name="entryDate"
                                            value={booking.entryDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                            <FaClock className="text-orange-500" /> Entry Time
                                        </label>
                                        <input
                                            type="time"
                                            name="entryTime"
                                            value={booking.entryTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                            <FaCalendarAlt className="text-orange-500" /> Exit Date
                                        </label>
                                        <input
                                            type="date"
                                            name="exitDate"
                                            value={booking.exitDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                                            <FaClock className="text-orange-500" /> Exit Time
                                        </label>
                                        <input
                                            type="time"
                                            name="exitTime"
                                            value={booking.exitTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || totalHours <= 0}
                                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-base"
                                >
                                    {loading ? "Creating Reservation..." : "Proceed to Payment →"}
                                </button>
                            </form>
                        </div>

                        {/* Summary */}
                        <div className="md:col-span-5 flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    Reservation Summary
                                </h3>

                                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Location:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{parking.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Rate / Hour:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">₹{parking.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Estimated Duration:</span>
                                        <span className="font-semibold text-orange-600">{totalHours} hrs</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Available Slots:</span>
                                        <span className="font-semibold text-emerald-600">{parking.availableSlots} left</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-baseline">
                                        <span className="font-bold text-slate-900 dark:text-white text-base">Total Amount:</span>
                                        <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                                            ₹{totalAmount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50/70 dark:bg-slate-800/60 rounded-3xl p-6 border border-orange-200/60 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                                    <FaShieldAlt /> 100% Guaranteed Slot
                                </div>
                                <p>Your slot is immediately held upon reservation and verified in real-time by the parking manager.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Booking;
