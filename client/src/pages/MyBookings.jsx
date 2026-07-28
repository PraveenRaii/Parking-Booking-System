import { useEffect, useState } from "react";
import API from "../services/api";

function MyBookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const res = await API.get("/booking");

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="max-w-7xl mx-auto py-10 px-5">

            <h1 className="text-4xl font-bold mb-8">

                My Bookings

            </h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {bookings.map((booking) => (

                    <div
                        key={booking._id}
                        className="bg-white shadow-lg rounded-xl p-5"
                    >

                        <h2 className="text-2xl font-bold">

                            {booking.parking?.name}

                        </h2>

                        <p>

                            Vehicle :
                            {booking.vehicleNumber}

                        </p>

                        <p>

                            Type :
                            {booking.vehicleType}

                        </p>

                        <p>

                            Hours :
                            {booking.totalHours}

                        </p>

                        <h3 className="text-blue-600 text-xl font-bold mt-3">

                            ₹{booking.totalAmount}

                        </h3>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default MyBookings;