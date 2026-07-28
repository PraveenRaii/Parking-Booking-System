import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddParking() {

    const navigate = useNavigate();

    const [parking, setParking] = useState({
        name: "",
        city: "",
        address: "",
        price: "",
        totalSlots: "",
        availableSlots: "",
        rating: "",
        image: ""
    });

    const handleChange = (e) => {
        setParking({
            ...parking,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.post("/parking", parking);

            alert("Parking Added Successfully");

            navigate("/admin/parking");

        } catch (err) {

            console.log(err);

            alert(err.response?.data?.message || "Failed to Add Parking");

        }

    };

    return (

        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">

            <h1 className="text-3xl font-bold mb-8">

                Add New Parking

            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-5"
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Parking Name"
                    value={parking.name}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={parking.city}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={parking.address}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price Per Hour"
                    value={parking.price}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="number"
                    name="totalSlots"
                    placeholder="Total Slots"
                    value={parking.totalSlots}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="number"
                    name="availableSlots"
                    placeholder="Available Slots"
                    value={parking.availableSlots}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                    required
                />

                <input
                    type="number"
                    step="0.1"
                    name="rating"
                    placeholder="Rating"
                    value={parking.rating}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={parking.image}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <button
                    type="submit"
                    className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                    Add Parking
                </button>

            </form>

        </div>

    );

}

export default AddParking;