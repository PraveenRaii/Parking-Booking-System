import { useEffect, useState } from "react";
import API from "../services/api";

function ManageBookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const res = await API.get("/booking/all");

            setBookings(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const approveBooking = async (id) => {

        try {

            await API.put(`/booking/approve/${id}`);

            alert("Booking Approved");

            fetchBookings();

        }

        catch (err) {

            console.log(err);

        }

    };

    const rejectBooking = async (id) => {

        try {

            await API.put(`/booking/reject/${id}`);

            alert("Booking Rejected");

            fetchBookings();

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-8">

                Manage Bookings

            </h1>

            <table className="w-full bg-white shadow rounded-lg">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="p-3">Parking</th>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        bookings.map((booking) => (

                            <tr
                                key={booking._id}
                                className="border-b text-center"
                            >

                                <td>

                                    {booking.parking?.name}

                                </td>

                                <td>

                                    {booking.user?.name || "Guest"}

                                </td>

                                <td>

                                    {booking.vehicleType}

                                </td>

                                <td>

                                    ₹{booking.totalAmount}

                                </td>

                                <td>

                                    <span

                                        className={
                                            booking.status === "Approved"
                                                ? "text-green-600 font-bold"
                                                : booking.status === "Rejected"
                                                    ? "text-red-600 font-bold"
                                                    : "text-yellow-600 font-bold"
                                        }

                                    >

                                        {booking.status}

                                    </span>

                                </td>

                                <td>

                                    <button

                                        onClick={() => approveBooking(booking._id)}

                                        className="bg-green-600 text-white px-3 py-2 rounded mr-2"

                                    >

                                        Approve

                                    </button>

                                    <button

                                        onClick={() => rejectBooking(booking._id)}

                                        className="bg-red-600 text-white px-3 py-2 rounded"

                                    >

                                        Reject

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ManageBookings;