import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Payment() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const booking = state?.booking;

    const [paymentMethod, setPaymentMethod] = useState("Card");

    if (!booking) {
        return (
            <h1 className="text-center mt-20 text-3xl font-bold">
                Booking Not Found
            </h1>
        );
    }

    const handlePayment = () => {

        alert("Payment Successful");

        navigate("/success", {
            state: {
                booking,
                paymentMethod
            }
        });

    };

    return (

        <div className="max-w-4xl mx-auto py-10 px-6">

            <h1 className="text-4xl font-bold mb-8">

                Payment

            </h1>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Left */}

                <div className="bg-white shadow-lg rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-5">

                        Select Payment Method

                    </h2>

                    <label className="flex gap-3 mb-4">

                        <input
                            type="radio"
                            value="Card"
                            checked={paymentMethod === "Card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        Credit / Debit Card

                    </label>

                    <label className="flex gap-3 mb-4">

                        <input
                            type="radio"
                            value="UPI"
                            checked={paymentMethod === "UPI"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        UPI

                    </label>

                    <label className="flex gap-3">

                        <input
                            type="radio"
                            value="Cash"
                            checked={paymentMethod === "Cash"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />

                        Cash

                    </label>

                    {
                        paymentMethod === "Card" && (

                            <div className="mt-6 space-y-4">

                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full border p-3 rounded-lg"
                                />

                                <input
                                    type="text"
                                    placeholder="Card Holder Name"
                                    className="w-full border p-3 rounded-lg"
                                />

                                <div className="grid grid-cols-2 gap-4">

                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="border p-3 rounded-lg"
                                    />

                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        className="border p-3 rounded-lg"
                                    />

                                </div>

                            </div>

                        )
                    }

                    {
                        paymentMethod === "UPI" && (

                            <input
                                type="text"
                                placeholder="Enter UPI ID"
                                className="mt-6 w-full border p-3 rounded-lg"
                            />

                        )
                    }

                </div>

                {/* Right */}

                <div className="bg-gray-100 rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-6">

                        Booking Summary

                    </h2>

                    <p className="mb-3">

                        Booking ID :
                        <span className="font-semibold">

                            {booking._id}

                        </span>

                    </p>

                    <p className="mb-3">

                        Vehicle :
                        <span className="font-semibold">

                            {booking.vehicleNumber}

                        </span>

                    </p>

                    <p className="mb-3">

                        Total Hours :
                        <span className="font-semibold">

                            {booking.totalHours}

                        </span>

                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-8">

                        ₹ {booking.totalAmount}

                    </h2>

                    <button

                        onClick={handlePayment}

                        className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"

                    >

                        Pay Now

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Payment;