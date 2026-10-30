import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaCar, FaReceipt } from "react-icons/fa";

function Success() {
    const { state } = useLocation();
    const booking = state?.booking;
    const paymentMethod = state?.paymentMethod || "Online";

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-6 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 shadow-xl border border-orange-100 dark:border-slate-700 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg shadow-emerald-500/30">
                        <FaCheckCircle />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-6">
                        Payment Successful!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Your parking slot has been reserved. A confirmation receipt has been issued.
                    </p>

                    <div className="mt-8 bg-orange-50/60 dark:bg-slate-900/60 rounded-2xl p-6 border border-orange-100 dark:border-slate-700 text-left space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-orange-200/60 dark:border-slate-700">
                            <span className="text-slate-500">Booking Reference:</span>
                            <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                                #{booking?._id ? booking._id.slice(-8).toUpperCase() : "PE-89412"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Vehicle:</span>
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {booking?.vehicleNumber || "Vehicle"} ({booking?.vehicleType || "Car"})
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Payment Mode:</span>
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {paymentMethod}
                            </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-orange-200/60 dark:border-slate-700 text-base">
                            <span className="font-bold text-slate-800 dark:text-white">Amount Paid:</span>
                            <span className="font-black text-xl text-orange-600 dark:text-orange-400">
                                ₹{booking?.totalAmount || 0}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Link
                            to="/my-bookings"
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition flex items-center justify-center gap-2"
                        >
                            <FaReceipt />
                            <span>View My Bookings</span>
                        </Link>

                        <Link
                            to="/"
                            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                        >
                            <FaCar />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Success;
