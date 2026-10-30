import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { FaEdit, FaTrash, FaPlus, FaCar } from "react-icons/fa";

function ManageParking() {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParkings = useCallback(async () => {
        try {
            const res = await API.get("/parking");
            setParkings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchParkings error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchParkings();
    }, [fetchParkings]);

    const deleteParking = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this parking space?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/parking/${id}`);
            alert("Parking spot deleted successfully! 🗑️");
            fetchParkings();
        } catch (err) {
            console.log("deleteParking error:", err);
            alert("Failed to delete parking spot.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Inventory</span>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            Manage Parking Spaces
                        </h1>
                    </div>

                    <Link
                        to="/admin/add-parking"
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition text-sm flex items-center gap-2"
                    >
                        <FaPlus />
                        <span>Add New Parking</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-orange-600 font-semibold">
                        Loading parking spaces...
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs uppercase font-extrabold tracking-wider">
                                    <tr>
                                        <th className="py-4 px-6">Image</th>
                                        <th className="py-4 px-6">Name</th>
                                        <th className="py-4 px-6">City</th>
                                        <th className="py-4 px-6">Rate / hr</th>
                                        <th className="py-4 px-6">Slot Availability</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    {parkings.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-400">
                                                No parking spots created yet. Click "+ Add New Parking" above.
                                            </td>
                                        </tr>
                                    ) : (
                                        parkings.map((parking) => (
                                            <tr
                                                key={parking._id}
                                                className="hover:bg-orange-50/40 dark:hover:bg-slate-700/40 transition"
                                            >
                                                <td className="py-3 px-6">
                                                    <img
                                                        src={parking.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400"}
                                                        alt={parking.name}
                                                        className="w-20 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                                    />
                                                </td>

                                                <td className="py-3 px-6 font-bold text-slate-900 dark:text-white">
                                                    <div className="flex items-center gap-2">
                                                        <FaCar className="text-orange-500" />
                                                        <span>{parking.name}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-normal">{parking.address}</span>
                                                </td>

                                                <td className="py-3 px-6 font-semibold text-slate-600 dark:text-slate-300">
                                                    {parking.city}
                                                </td>

                                                <td className="py-3 px-6 font-black text-orange-600 dark:text-orange-400">
                                                    ₹{parking.price}
                                                </td>

                                                <td className="py-3 px-6">
                                                    <span className="font-bold text-slate-800 dark:text-white">
                                                        {parking.availableSlots}
                                                    </span>
                                                    <span className="text-slate-400"> / {parking.totalSlots}</span>
                                                </td>

                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <Link
                                                            to={`/admin/edit/${parking._id}`}
                                                            className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 rounded-xl transition"
                                                            title="Edit parking"
                                                        >
                                                            <FaEdit size={14} />
                                                        </Link>

                                                        <button
                                                            onClick={() => deleteParking(parking._id)}
                                                            className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl transition"
                                                            title="Delete parking"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ManageParking;
