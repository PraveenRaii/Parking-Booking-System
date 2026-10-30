import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaMapMarkerAlt, FaStar, FaTrash } from "react-icons/fa";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await API.get("/favorites");
            setFavorites(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchFavorites error:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const removeFavorite = async (parkingId) => {
        try {
            await API.delete(`/favorites/${parkingId}`);
            setFavorites((prev) => prev.filter((item) => item.parking?._id !== parkingId));
        } catch (err) {
            console.log("removeFavorite error:", err);
        }
    };

    const validFavorites = favorites.filter((item) => item && item.parking && item.parking._id);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Saved Places</span>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-1">
                            🧡 My Favorite Parkings
                        </h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-orange-600 font-semibold">
                            Loading your saved parking spots...
                        </div>
                    ) : validFavorites.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-orange-200 dark:border-slate-700 max-w-lg mx-auto">
                            <span className="text-5xl">🧡</span>
                            <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">No Favorites Yet</h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Click the heart icon on any parking spot on the home page to save it for quick access!
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 transition"
                            >
                                Browse Parking Spaces
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {validFavorites.map((item) => {
                                const parking = item.parking;
                                return (
                                    <div
                                        key={item._id}
                                        className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl border border-orange-100 dark:border-slate-700 overflow-hidden flex flex-col justify-between transition"
                                    >
                                        <div>
                                            <div className="relative">
                                                <img
                                                    src={parking.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"}
                                                    alt={parking.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <button
                                                    onClick={() => removeFavorite(parking._id)}
                                                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 hover:bg-rose-50 text-rose-500 rounded-full shadow-md transition"
                                                    title="Remove from favorites"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>

                                            <div className="p-6">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    {parking.name}
                                                </h2>

                                                <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                                                    <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                                                    <span>{parking.city}</span>
                                                </p>

                                                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold mt-2">
                                                    <FaStar /> {parking.rating || 4.5}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                                            <span className="text-xl font-black text-orange-600 dark:text-orange-400">
                                                ₹{parking.price}<span className="text-xs font-normal text-slate-500">/hr</span>
                                            </span>

                                            <button
                                                onClick={() => navigate(`/parking/${parking._id}`)}
                                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md shadow-orange-500/20 transition"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Favorites;
