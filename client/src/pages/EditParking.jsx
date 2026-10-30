import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";

function EditParking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [parking, setParking] = useState({
        name: "",
        city: "",
        address: "",
        type: "Car",
        price: "",
        totalSlots: "",
        availableSlots: "",
        rating: "",
        image: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchParking = useCallback(async () => {
        try {
            const res = await API.get(`/parking/${id}`);
            if (res.data) {
                setParking(res.data);
            }
        } catch (err) {
            console.log("fetchParking error:", err);
            alert("Failed to load parking spot data.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchParking();
    }, [fetchParking]);

    const handleChange = (e) => {
        setParking((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await API.put(`/parking/${id}`, parking);
            alert("Parking Space Updated Successfully! ✅");
            navigate("/admin/parking");
        } catch (err) {
            console.log("updateParking error:", err);
            alert("Failed to update parking spot.");
        } finally {
            setSaving(false);
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
                            Edit Parking Space
                        </h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-orange-600 font-semibold">
                            Loading parking details...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parking Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={parking.name || ""}
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
                                    value={parking.city || ""}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Category</label>
                                <select
                                    name="type"
                                    value={parking.type || "Car"}
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
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={parking.address || ""}
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
                                    value={parking.price || ""}
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
                                    value={parking.totalSlots || ""}
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
                                    value={parking.availableSlots || ""}
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
                                    value={parking.rating || ""}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={parking.image || ""}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="col-span-2 mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/parking")}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition"
                                >
                                    {saving ? "Saving Changes..." : "Update Parking"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default EditParking;
