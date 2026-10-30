import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";

function AddParking() {
    const navigate = useNavigate();

    const [parking, setParking] = useState({
        name: "",
        city: "",
        address: "",
        type: "Car",
        price: "",
        totalSlots: "",
        availableSlots: "",
        rating: "4.8",
        image: "",
        latitude: "28.6139",
        longitude: "77.2090"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setParking((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const payload = {
                ...parking,
                price: Number(parking.price),
                totalSlots: Number(parking.totalSlots),
                availableSlots: Number(parking.availableSlots || parking.totalSlots),
                rating: Number(parking.rating || 4.5),
                image: parking.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
            };

            await API.post("/parking", payload);
            alert("Parking Space Added Successfully! 🚗");
            navigate("/admin/parking");
        } catch (err) {
            console.log("AddParking error:", err);
            alert(err.response?.data?.message || "Failed to Add Parking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-md border border-orange-100 dark:border-slate-700 rounded-3xl p-8">
                    <div className="mb-6">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Inventory</span>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            Add New Parking Space
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parking Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. City Central Multi-Level Parking"
                                value={parking.name}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="e.g. Delhi, Mumbai, Lucknow"
                                value={parking.city}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Category</label>
                            <select
                                name="type"
                                value={parking.type}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                                <option value="EV">EV (Electric Vehicle)</option>
                                <option value="Bicycle">Bicycle</option>
                                <option value="Bus">Bus</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Complete Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="e.g. Sector 18, Block B, Near Metro Station"
                                value={parking.address}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price Per Hour (₹)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="e.g. 50"
                                value={parking.price}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Slots</label>
                            <input
                                type="number"
                                name="totalSlots"
                                placeholder="e.g. 30"
                                value={parking.totalSlots}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Available Slots</label>
                            <input
                                type="number"
                                name="availableSlots"
                                placeholder="e.g. 30"
                                value={parking.availableSlots}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="5"
                                name="rating"
                                placeholder="4.8"
                                value={parking.rating}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                placeholder="28.6139"
                                value={parking.latitude}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                placeholder="77.2090"
                                value={parking.longitude}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={parking.image}
                                onChange={handleChange}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="col-span-2 mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-base"
                        >
                            {loading ? "Adding Parking Space..." : "+ Add Parking Space"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddParking;
