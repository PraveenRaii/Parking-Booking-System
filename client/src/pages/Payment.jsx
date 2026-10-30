import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaShieldAlt } from "react-icons/fa";

function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const booking = state?.booking;
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [processing, setProcessing] = useState(false);

    if (!booking) {
        return (
            <>
                <Navbar />
                <div className="max-w-md mx-auto text-center py-20 px-6">
                    <span className="text-5xl">⚠️</span>
                    <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">Booking Not Found</h2>
                    <p className="text-slate-500 text-sm mt-2">No active booking session found. Please start your booking from the home page.</p>
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

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            navigate("/success", {
                state: {
                    booking,
                    paymentMethod
                }
            });
        }, 1200);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Step 2 of 2</span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-1">
                            Secure Checkout
                        </h1>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">
                        {/* Payment Method Selector */}
                        <div className="md:col-span-7 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                Choose Payment Method
                            </h2>

                            <div className="space-y-3">
                                <label
                                    onClick={() => setPaymentMethod("UPI")}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                                        paymentMethod === "UPI"
                                            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-orange-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "UPI"}
                                        onChange={() => setPaymentMethod("UPI")}
                                        className="accent-orange-500 w-4 h-4"
                                    />
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaMobileAlt className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">UPI / QR Code</p>
                                        <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                </label>

                                <label
                                    onClick={() => setPaymentMethod("Card")}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                                        paymentMethod === "Card"
                                            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-orange-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "Card"}
                                        onChange={() => setPaymentMethod("Card")}
                                        className="accent-orange-500 w-4 h-4"
                                    />
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaCreditCard className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">Credit / Debit Card</p>
                                        <p className="text-xs text-slate-400">Visa, Mastercard, RuPay</p>
                                    </div>
                                </label>

                                <label
                                    onClick={() => setPaymentMethod("Cash")}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                                        paymentMethod === "Cash"
                                            ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-orange-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "Cash"}
                                        onChange={() => setPaymentMethod("Cash")}
                                        className="accent-orange-500 w-4 h-4"
                                    />
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaMoneyBillWave className="text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">Pay at Parking (Cash)</p>
                                        <p className="text-xs text-slate-400">Pay directly at the entrance booth</p>
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === "UPI" && (
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Your UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. mobile@upi or username@okhdfcbank"
                                        defaultValue="user@upi"
                                        className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            )}

                            {paymentMethod === "Card" && (
                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="4532 •••• •••• 8910"
                                            defaultValue="4532 8921 7843 8910"
                                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                defaultValue="12/28"
                                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                defaultValue="891"
                                                maxLength="4"
                                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-5 flex flex-col gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Vehicle:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{booking.vehicleNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Vehicle Type:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{booking.vehicleType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Duration:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{booking.totalHours} hrs</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Timing:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{booking.entryTime} - {booking.exitTime}</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-baseline">
                                        <span className="font-bold text-slate-900 dark:text-white text-base">Payable:</span>
                                        <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                                            ₹{booking.totalAmount}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="mt-6 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Processing Payment...</span>
                                        </>
                                    ) : (
                                        <span>Pay ₹{booking.totalAmount} Now 🔒</span>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                                <FaShieldAlt className="text-emerald-500" /> 256-bit Bank Grade Encrypted Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
