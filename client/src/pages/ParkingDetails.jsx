import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ReviewForm from "../components/ReviewForm";
import FavoriteButton from "../components/FavoriteButton";
import Navbar from "../components/Navbar";
import ParkingMap from "../components/ParkingMap";
import MapErrorBoundary from "../components/MapErrorBoundary";
import socket from "../socket";
import { calculateDistanceKm, estimateDrivingTime, getDirectionsUrl } from "../services/distance";
import { FaMapMarkerAlt, FaStar, FaCar, FaShieldAlt, FaClock, FaRoute, FaDirections, FaLocationArrow } from "react-icons/fa";

function ParkingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [parking, setParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    const fetchParking = useCallback(async () => {
        try {
            const res = await API.get(`/parking/${id}`);
            setParking(res.data);
        } catch (err) {
            console.log("fetchParking error:", err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await API.get(`/reviews/${id}`);
            setReviews(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchReviews error:", err.message);
        }
    }, [id]);

    useEffect(() => {
        fetchParking();
        fetchReviews();

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => console.log("Geolocation error in details:", err.message)
            );
        }

        const handleSlotUpdate = (data) => {
            if (data.parkingId === id) {
                setParking((prev) => (prev ? { ...prev, availableSlots: data.availableSlots } : prev));
            }
        };

        socket.on("slotUpdated", handleSlotUpdate);

        return () => {
            socket.off("slotUpdated", handleSlotUpdate);
        };
    }, [id, fetchParking, fetchReviews]);

    // Compute route and distance metrics
    const routeMetrics = useMemo(() => {
        if (!parking?.location?.coordinates || !Array.isArray(parking.location.coordinates) || parking.location.coordinates.length < 2) {
            return null;
        }

        const destLat = Number(parking.location.coordinates[1]);
        const destLng = Number(parking.location.coordinates[0]);

        if (isNaN(destLat) || isNaN(destLng)) return null;

        const effectiveOrigin = userLocation || { lat: 28.6139, lng: 77.2090 };
        const distKm = calculateDistanceKm(effectiveOrigin.lat, effectiveOrigin.lng, destLat, destLng);
        const eta = estimateDrivingTime(distKm);
        const directionsUrl = getDirectionsUrl(destLat, destLng, userLocation);

        return {
            destLat,
            destLng,
            distKm,
            eta,
            directionsUrl,
            hasLiveGps: Boolean(userLocation)
        };
    }, [parking, userLocation]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-orange-600">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-semibold">Loading parking details...</p>
                </div>
            </>
        );
    }

    if (!parking) {
        return (
            <>
                <Navbar />
                <div className="max-w-md mx-auto text-center py-20 px-6">
                    <span className="text-5xl">🚗</span>
                    <h2 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">Parking Not Found</h2>
                    <p className="text-slate-500 text-sm mt-2">The parking space you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
                    >
                        Back to Home
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Parking Hero Header */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-orange-100 dark:border-slate-700 overflow-hidden">
                        <div className="relative h-80 md:h-[400px]">
                            <img
                                src={parking.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200"}
                                alt={parking.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <FavoriteButton parkingId={parking._id} />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                                <FaCar className="text-orange-400" />
                                <span>{parking.type || "All Vehicles Allowed"}</span>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-500 flex items-center gap-1 font-bold text-sm bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                                            <FaStar /> {parking.rating || 4.5} ({reviews.length} reviews)
                                        </span>
                                        <span className="text-xs font-semibold px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-full">
                                            {parking.city}
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
                                        {parking.name}
                                    </h1>

                                    <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-base mt-2">
                                        <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                                        <span>{parking.address}, {parking.city}</span>
                                    </p>
                                </div>

                                <div className="bg-orange-50 dark:bg-slate-900/80 border border-orange-200 dark:border-slate-700 p-6 rounded-2xl flex flex-col items-center md:items-end justify-center min-w-[220px]">
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hourly Rate</span>
                                    <span className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">
                                        ₹{parking.price}<span className="text-sm font-normal text-slate-500"> /hr</span>
                                    </span>

                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                        <span className="font-bold text-slate-800 dark:text-white">{parking.availableSlots}</span> of {parking.totalSlots} Slots Free
                                    </p>

                                    {parking.availableSlots === 0 ? (
                                        <button
                                            disabled
                                            className="mt-4 w-full bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed font-bold py-3 px-6 rounded-xl text-center text-sm"
                                        >
                                            Currently Full
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate("/booking", { state: { parking } })}
                                            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-sm"
                                        >
                                            Book Slot Now 🚗
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Features Highlights */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                    <span className="p-3 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaShieldAlt />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-400">Security</p>
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">CCTV 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                    <span className="p-3 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaClock />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-400">Operation</p>
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">Instant Entry</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                    <span className="p-3 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                                        <FaCar />
                                    </span>
                                    <div>
                                        <p className="text-xs text-slate-400">Slot Size</p>
                                        <p className="font-bold text-sm text-slate-800 dark:text-white">Standard & EV</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Distance & Driving Route Section */}
                    {routeMetrics && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-orange-100 dark:border-slate-700 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md text-sm">
                                            <FaRoute />
                                        </span>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            Parking Distance & Route
                                        </h2>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        {routeMetrics.hasLiveGps
                                            ? "Real-time driving distance computed from your GPS location"
                                            : "Estimated driving distance from city center"}
                                    </p>
                                </div>

                                <a
                                    href={routeMetrics.directionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-sm"
                                >
                                    <FaDirections size={16} />
                                    <span>Start Turn-by-Turn Navigation</span>
                                </a>
                            </div>

                            {/* Distance & Time Metric Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                                <div className="bg-orange-50 dark:bg-orange-950/40 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/40">
                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                                        <FaLocationArrow /> Distance
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                        {routeMetrics.distKm} <span className="text-base font-semibold text-slate-500">km</span>
                                    </p>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Accurate Haversine road calculation</span>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/40">
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                                        <FaClock /> Estimated Time
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                        ~{routeMetrics.eta}
                                    </p>
                                    <span className="text-[11px] text-slate-400 mt-1 block">City driving speed with traffic allowance</span>
                                </div>

                                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                        <FaCar /> Vehicle Route
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-2 truncate">
                                        {parking.city}
                                    </p>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Direct road access enabled</span>
                                </div>
                            </div>

                            {/* Embedded Route Map */}
                            <div className="mt-4">
                                <MapErrorBoundary parking={parking} userLocation={userLocation}>
                                    <ParkingMap
                                        parkings={[parking]}
                                        focusedParking={parking}
                                        userLocation={userLocation}
                                    />
                                </MapErrorBoundary>
                            </div>
                        </div>
                    )}

                    {/* Review Form & Reviews List */}
                    <ReviewForm parkingId={id} onReviewAdded={fetchReviews} />

                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                            <span>💬</span> Customer Reviews ({reviews.length})
                        </h2>

                        {reviews.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-500 border border-slate-100 dark:border-slate-700">
                                Be the first to leave a review for {parking.name}!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center">
                                                    {(review.user?.name || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                                        {review.user?.name || "Verified Customer"}
                                                    </h3>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="text-amber-500 font-bold flex items-center gap-1 text-sm bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full">
                                                <FaStar /> {review.rating}
                                            </span>
                                        </div>

                                        <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ParkingDetails;