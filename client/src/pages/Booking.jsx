import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function Booking() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const parking = state?.parking;

    const [loading, setLoading] = useState(false);

    const [booking, setBooking] = useState({
        vehicleType: "",
        vehicleNumber: "",
        entryDate: "",
        entryTime: "",
        exitDate: "",
        exitTime: ""
    });

    const [totalHours, setTotalHours] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);


    if (!parking) {

        return (
            <div className="text-center mt-20">

                <h1 className="text-3xl font-bold">
                    Parking not found
                </h1>

            </div>
        );

    }


    const handleChange = (e) => {

        setBooking({
            ...booking,
            [e.target.name]: e.target.value
        });

    };


    const calculatePrice = () => {

        if (
            !booking.entryDate ||
            !booking.entryTime ||
            !booking.exitDate ||
            !booking.exitTime
        ) {

            alert("Please select entry and exit date/time");

            return;

        }


        const entry = new Date(
            `${booking.entryDate}T${booking.entryTime}`
        );

        const exit = new Date(
            `${booking.exitDate}T${booking.exitTime}`
        );


        if (exit <= entry) {

            alert("Exit time should be greater than Entry time");

            return;

        }


        const diff = exit - entry;

        const hours = Math.ceil(
            diff / (1000 * 60 * 60)
        );


        setTotalHours(hours);

        setTotalAmount(
            hours * (parking.price || 0)
        );

    };


    const handleBooking = async () => {

        // Prevent multiple clicks
        if (loading) {
            return;
        }


        if (totalAmount <= 0) {

            alert("Please calculate price first");

            return;

        }


        if (!booking.vehicleNumber || !booking.vehicleType) {

            alert("Please enter vehicle details");

            return;

        }


        try {

            setLoading(true);


            const data = {

                parking: parking._id,

                vehicleNumber: booking.vehicleNumber,

                vehicleType: booking.vehicleType,

                entryDate: booking.entryDate,

                entryTime: booking.entryTime,

                exitDate: booking.exitDate,

                exitTime: booking.exitTime,

                totalHours: totalHours,

                totalAmount: totalAmount

            };


            console.log("BOOKING REQUEST:", data);


            const res = await API.post(
                "/booking",
                data
            );


            console.log(
                "BOOKING RESPONSE:",
                res.data
            );


            alert(res.data.message);


            navigate("/payment", {

                state: {

                    booking: res.data.booking

                }

            });


        }

        catch (err) {

            console.log(
                "BOOKING ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Booking Failed"
            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-black dark:text-white">


            <h1 className="text-3xl font-bold mb-6">

                Booking Details

            </h1>


            <h2 className="text-xl font-semibold text-blue-600">

                {parking.name}

            </h2>


            <div className="grid grid-cols-2 gap-5 mt-8">


                <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="Vehicle Number"
                    value={booking.vehicleNumber}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />


                <select
                    name="vehicleType"
                    value={booking.vehicleType}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                >

                    <option value="">
                        Select Vehicle
                    </option>

                    <option value="Car">
                        Car
                    </option>

                    <option value="Bike">
                        Bike
                    </option>

                    <option value="EV">
                        EV
                    </option>

                </select>


                <input
                    type="date"
                    name="entryDate"
                    value={booking.entryDate}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />


                <input
                    type="time"
                    name="entryTime"
                    value={booking.entryTime}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />


                <input
                    type="date"
                    name="exitDate"
                    value={booking.exitDate}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />


                <input
                    type="time"
                    name="exitTime"
                    value={booking.exitTime}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

            </div>


            <button
                onClick={calculatePrice}
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
            >

                Calculate Price

            </button>


            {totalAmount > 0 && (

                <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-5 rounded-xl">


                    <h2 className="text-2xl font-bold mb-4">

                        Booking Summary

                    </h2>


                    <p>

                        Parking:

                        <span className="font-semibold">

                            {" "}{parking.name}

                        </span>

                    </p>


                    <p>

                        Total Hours:

                        <span className="font-semibold">

                            {" "}{totalHours}

                        </span>

                    </p>


                    <p>

                        Price / Hour:

                        <span className="font-semibold">

                            {" "}₹{parking.price}

                        </span>

                    </p>


                    <h3 className="text-2xl text-blue-600 font-bold mt-4">

                        Total ₹{totalAmount}

                    </h3>


                    <button
                        onClick={handleBooking}
                        disabled={loading}
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold"
                    >

                        {loading
                            ? "Processing..."
                            : "Proceed To Payment"
                        }

                    </button>


                </div>

            )}

        </div>

    );

}

export default Booking;