import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {

    const [data, setData] = useState({});

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        const res = await API.get("/dashboard");

        setData(res.data);

    };

    const cards = [

        {
            title: "Users",
            value: data.totalUsers,
            color: "bg-blue-600",
            link: "/admin/users"
        },

        {
            title: "Parking",
            value: data.totalParking,
            color: "bg-green-600",
            link: "/admin/parking"
        },

        {
            title: "Bookings",
            value: data.totalBookings,
            color: "bg-purple-600",
            link: "/admin/bookings"
        },

        {
            title: "Revenue",
            value: `₹${data.revenue}`,
            color: "bg-red-600",
            link: "#"
        },

        {
            title: "Available",
            value: data.availableSlots,
            color: "bg-cyan-600",
            link: "#"
        },

        {
            title: "Occupied",
            value: data.occupiedSlots,
            color: "bg-yellow-600",
            link: "#"
        }

    ];

    return (

        <div className="max-w-7xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-10">

                Admin Dashboard

            </h1>

            <div className="grid md:grid-cols-3 gap-8">

                {

                    cards.map((card, index) => (

                        <Link

                            key={index}

                            to={card.link}

                            className={`${card.color} text-white rounded-xl p-8 shadow-lg hover:scale-105 duration-300`}

                        >

                            <h2 className="text-xl">

                                {card.title}

                            </h2>

                            <h1 className="text-5xl font-bold mt-4">

                                {card.value}

                            </h1>

                        </Link>

                    ))

                }

            </div>

        </div>

    );

}

export default AdminDashboard;