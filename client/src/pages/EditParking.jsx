import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditParking() {

    const { id } = useParams();
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

    useEffect(() => {
        fetchParking();
    }, []);

    const fetchParking = async () => {

        try {

            const res = await API.get(`/parking/${id}`);

            setParking(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        setParking({
            ...parking,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.put(`/parking/${id}`, parking);

            alert("Parking Updated Successfully");

            navigate("/admin/parking");

        } catch (err) {

            console.log(err);

            alert("Update Failed");

        }

    };

    return (

        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-8">

            <h1 className="text-3xl font-bold mb-8">

                Edit Parking

            </h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-5"
            >

                <input
                    type="text"
                    name="name"
                    value={parking.name}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="text"
                    name="city"
                    value={parking.city}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="text"
                    name="address"
                    value={parking.address}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="number"
                    name="price"
                    value={parking.price}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="number"
                    name="totalSlots"
                    value={parking.totalSlots}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="number"
                    name="availableSlots"
                    value={parking.availableSlots}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={parking.rating}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="text"
                    name="image"
                    value={parking.image}
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <button
                    className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                >
                    Update Parking
                </button>

            </form>

        </div>

    );

}

export default EditParking;