import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ManageParking() {

    const [parkings, setParkings] = useState([]);

    useEffect(() => {

        fetchParkings();

    }, []);

    const fetchParkings = async () => {

        try {

            const res = await API.get("/parking");

            setParkings(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const deleteParking = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this parking?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/parking/${id}`);

            alert("Parking Deleted");

            fetchParkings();

        }

        catch (err) {

            console.log(err);

            alert("Delete Failed");

        }

    };

    return (
        

        <div className="max-w-7xl mx-auto p-8">

            <div className="flex justify-between mb-8">

                <h1 className="text-4xl font-bold">

                    Manage Parking

                </h1>

                <Link

                    to="/admin/add-parking"

                    className="bg-blue-600 text-white px-5 py-3 rounded-lg"

                >

                    + Add Parking

                </Link>

            </div>

            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="p-3">Image</th>

                        <th>Name</th>

                        <th>City</th>

                        <th>Price</th>

                        <th>Slots</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        parkings.map((parking) => (

                            <tr
                                key={parking._id}
                                className="text-center border-b"
                            >

                                <td className="p-3">

                                    <img

                                        src={parking.image}

                                        className="w-24 h-16 rounded object-cover mx-auto"

                                    />

                                </td>

                                <td>

                                    {parking.name}

                                </td>

                                <td>

                                    {parking.city}

                                </td>

                                <td>

                                    ₹{parking.price}

                                </td>

                                <td>

                                    {parking.availableSlots}/{parking.totalSlots}

                                </td>

                                <td>

                                    <div className="flex justify-center gap-3">

                                        <Link

                                            to={`/admin/edit/${parking._id}`}

                                            className="bg-yellow-500 px-4 py-2 rounded text-white"

                                        >

                                            Edit

                                        </Link>

                                        <button

                                            onClick={() => deleteParking(parking._id)}

                                            className="bg-red-600 px-4 py-2 rounded text-white"

                                        >

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ManageParking;