import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

function FavoriteButton({ parkingId }) {
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkFavorite = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await API.get("/favorites");
            if (Array.isArray(res.data)) {
                const exists = res.data.find(
                    (item) => item?.parking && (item.parking._id === parkingId || item.parking === parkingId)
                );
                setFavorite(!!exists);
            }
        } catch (err) {
            console.log("checkFavorite error:", err.message);
        }
    }, [parkingId]);

    useEffect(() => {
        if (parkingId) {
            checkFavorite();
        }
    }, [parkingId, checkFavorite]);

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to save favorite parking spots.");
            return;
        }

        try {
            setLoading(true);
            if (favorite) {
                await API.delete(`/favorites/${parkingId}`);
                setFavorite(false);
            } else {
                await API.post("/favorites", { parkingId });
                setFavorite(true);
            }
        } catch (err) {
            console.log("toggleFavorite error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className="text-2xl hover:scale-110 active:scale-95 transition flex items-center justify-center p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-slate-700"
        >
            {favorite ? "🧡" : "🤍"}
        </button>
    );
}

export default FavoriteButton;
