import { FaMapMarkerAlt, FaStar, FaRoute, FaDirections, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { calculateDistanceKm, estimateDrivingTime, getDirectionsUrl } from "../services/distance";

function ParkingCard({ parking, userLocation = null, onShowRoute = null, isNearest = false }) {
    const navigate = useNavigate();

    const hasCoords =
        parking?.location?.coordinates &&
        Array.isArray(parking.location.coordinates) &&
        parking.location.coordinates.length === 2 &&
        !isNaN(parking.location.coordinates[0]) &&
        !isNaN(parking.location.coordinates[1]);

    const destLat = hasCoords ? Number(parking.location.coordinates[1]) : null;
    const destLng = hasCoords ? Number(parking.location.coordinates[0]) : null;

    const distKm = userLocation && destLat && destLng
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, destLat, destLng)
        : null;

    const estTime = distKm ? estimateDrivingTime(distKm) : null;

    const handleRouteClick = (e) => {
        e.stopPropagation();
        if (typeof onShowRoute === "function") {
            onShowRoute(parking);
        } else if (destLat && destLng) {
            window.open(getDirectionsUrl(destLat, destLng, userLocation), "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl border border-orange-100/90 dark:border-slate-700 overflow-hidden hover:scale-[1.01] transition duration-300 flex flex-col justify-between">
            <div>
                {/* Image & Badges */}
                <div className="relative">
                    <img
                        src={parking.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"}
                        alt={parking.name}
                        className="w-full h-52 object-cover"
                    />

                    {/* Favorite Button */}
                    <div className="absolute top-3.5 right-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                        <FavoriteButton parkingId={parking._id} />
                    </div>

                    {/* Top-Left Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                        {isNearest && (
                            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                Nearest to you
                            </span>
                        )}
                        <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {parking.type || "All Vehicles"}
                        </span>
                    </div>

                    {/* Live Distance & ETA Pill overlay on bottom-right of image */}
                    {distKm !== null && (
                        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-orange-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                            <span>📍 {distKm} km</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <FaClock size={10} className="text-orange-500" />
                                ~{estTime}
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {parking.name}
                    </h3>

                    <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-2">
                        <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                        <span className="truncate">{parking.address ? `${parking.address}, ` : ""}{parking.city}</span>
                    </p>

                    {/* Distance & Route highlight block */}
                    {distKm !== null ? (
                        <div className="mt-3 p-2.5 bg-orange-50/70 dark:bg-orange-950/30 rounded-xl border border-orange-100 dark:border-orange-900/50 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-orange-700 dark:text-orange-300">
                                <span>📍 {distKm} km distance</span>
                                <span className="text-orange-400 font-normal">({estTime} drive)</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleRouteClick}
                                className="inline-flex items-center gap-1 font-extrabold text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:underline cursor-pointer"
                            >
                                <FaRoute size={12} />
                                <span>View Route</span>
                            </button>
                        </div>
                    ) : (
                        <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="truncate">GPS coordinates available</span>
                            {hasCoords && (
                                <button
                                    type="button"
                                    onClick={handleRouteClick}
                                    className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 cursor-pointer"
                                >
                                    <FaRoute size={12} />
                                    <span>Route</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Rating & Availability */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-sm">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                            <FaStar /> {parking.rating || 4.5}
                        </span>

                        <div className="text-xs">
                            <span className="text-slate-400">Available: </span>
                            <span className={`font-extrabold ${
                                parking.availableSlots > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                            }`}>
                                {parking.availableSlots}
                            </span>
                            <span className="text-slate-400"> / {parking.totalSlots}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price & Actions */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-2 gap-2">
                <div>
                    <span className="text-xs text-slate-400 block">Rate</span>
                    <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                        ₹{parking.price}
                    </span>
                    <span className="text-xs text-slate-500 font-normal"> /hr</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Route Button */}
                    <button
                        type="button"
                        onClick={handleRouteClick}
                        title="Show Driving Route on Map"
                        className="p-2.5 rounded-xl border border-orange-200 dark:border-slate-600 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-slate-700 transition"
                    >
                        <FaDirections size={18} />
                    </button>

                    {parking.availableSlots === 0 ? (
                        <span className="px-5 py-2.5 bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl font-bold text-sm">
                            Full
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate(`/parking/${parking._id}`)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-sm"
                        >
                            Book Slot
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ParkingCard;