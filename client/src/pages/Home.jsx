import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ParkingMap from "../components/ParkingMap";
import MapErrorBoundary from "../components/MapErrorBoundary";
import ParkingCard from "../components/ParkingCard";
import socket from "../socket";
import Hero from "../components/Hero";
import { FaBolt, FaCar, FaMotorcycle, FaRoute, FaTimes } from "react-icons/fa";

function Home() {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [city, setCity] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [priceRange, setPriceRange] = useState(1000);
    const [rating, setRating] = useState(0);

    const [userLocation, setUserLocation] = useState(null);
    const [focusedParking, setFocusedParking] = useState(null);

    const categories = [
        { name: "All", icon: <FaBolt /> },
        { name: "Car", icon: <FaCar /> },
        { name: "Bike", icon: <FaMotorcycle /> },
        { name: "EV", icon: <FaBolt /> },
        { name: "Bicycle", icon: <FaMotorcycle /> }
    ];

    const fetchParkings = useCallback(async () => {
        try {
            const res = await API.get("/parking");
            setParkings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("Failed to fetch parking spaces:", err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchParkings();

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => console.log("Geolocation error:", err.message)
            );
        }

        const handleSlotUpdate = (data) => {
            setParkings((prev) =>
                prev.map((p) =>
                    p._id === data.parkingId
                        ? { ...p, availableSlots: data.availableSlots }
                        : p
                )
            );
        };

        socket.on("slotUpdated", handleSlotUpdate);

        return () => {
            socket.off("slotUpdated", handleSlotUpdate);
        };
    }, [fetchParkings]);

    const cities = useMemo(() => {
        const unique = new Set(
            parkings.map((p) => p.city).filter(Boolean)
        );
        return ["All", ...Array.from(unique)];
    }, [parkings]);

    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    const filteredParkings = useMemo(() => {
        return parkings.filter((parking) => {
            const pName = (parking.name || "").toLowerCase();
            const pCity = (parking.city || "").toLowerCase();
            const pAddr = (parking.address || "").toLowerCase();
            const term = search.toLowerCase();

            const searchMatch = pName.includes(term) || pCity.includes(term) || pAddr.includes(term);
            const cityMatch = city === "All" || parking.city === city;
            const categoryMatch = category === "All" || parking.type === category;
            const priceMatch = Number(parking.price || 0) <= priceRange;
            const ratingMatch = Number(parking.rating || 0) >= rating;

            return searchMatch && cityMatch && categoryMatch && priceMatch && ratingMatch;
        });
    }, [parkings, search, city, category, priceRange, rating]);

    const sortedParkings = useMemo(() => {
        const list = [...filteredParkings];

        if (sortBy === "low") {
            list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "high") {
            list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === "rating") {
            list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (userLocation) {
            list.sort((a, b) => {
                const aCoords = a.location?.coordinates;
                const bCoords = b.location?.coordinates;
                if (!Array.isArray(aCoords) || aCoords.length < 2) return 1;
                if (!Array.isArray(bCoords) || bCoords.length < 2) return -1;

                const d1 = calculateDistance(userLocation.lat, userLocation.lng, aCoords[1], aCoords[0]);
                const d2 = calculateDistance(userLocation.lat, userLocation.lng, bCoords[1], bCoords[0]);
                return d1 - d2;
            });
        }
        return list;
    }, [filteredParkings, sortBy, userLocation, calculateDistance]);

    return (
        <>
            <Navbar />
            <Hero />

            <div id="search-section" className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
                {/* Search & Filters Card */}
                <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-700 p-6">
                        <div className="grid md:grid-cols-12 gap-4">
                            {/* Search */}
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search location, name, city..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition"
                                />
                            </div>

                            {/* City */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition"
                                >
                                    {cities.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition"
                                >
                                    <option value="">Default (Nearest)</option>
                                    <option value="low">Price: Low to High</option>
                                    <option value="high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            {/* Rating */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition"
                                >
                                    <option value="0">All Ratings</option>
                                    <option value="4">4.0+ Stars</option>
                                    <option value="4.5">4.5+ Stars</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Max Price</label>
                                    <span className="text-xs font-extrabold text-orange-600">₹{priceRange}/hr</span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="500"
                                    step="10"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-orange-500 cursor-pointer mt-1"
                                />
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Category:</span>
                            {categories.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setCategory(item.name)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition ${
                                        category === item.name
                                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600"
                                    }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Parking Cards Header */}
                <div className="max-w-7xl mx-auto px-6 mt-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Available Parking Spaces
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Showing {sortedParkings.length} verified locations
                        </p>
                    </div>
                </div>

                {/* Parking Cards Grid */}
                <div className="max-w-7xl mx-auto px-6 py-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-orange-600">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="font-semibold text-lg">Finding available parking spaces...</p>
                        </div>
                    ) : sortedParkings.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-dashed border-orange-200 dark:border-slate-700">
                            <span className="text-5xl">🚗</span>
                            <h3 className="text-2xl font-bold mt-4 text-slate-800 dark:text-white">No Parking Spaces Found</h3>
                            <p className="text-slate-500 mt-2 max-w-md mx-auto">
                                We couldn't find any parking matching your search criteria. Try adjusting your filters or search terms.
                            </p>
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("All");
                                    setCity("All");
                                    setPriceRange(500);
                                }}
                                className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-md shadow-orange-500/20"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedParkings.map((parking, index) => (
                                <ParkingCard
                                    key={parking._id}
                                    parking={parking}
                                    userLocation={userLocation}
                                    isNearest={index === 0 && Boolean(userLocation)}
                                    onShowRoute={(p) => {
                                        setFocusedParking(p);
                                        const mapEl = document.getElementById("interactive-map-section");
                                        if (mapEl) {
                                            mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Google Map Section */}
                <div id="interactive-map-section" className="max-w-7xl mx-auto px-6 pt-10 scroll-mt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md text-sm">
                                    <FaRoute />
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Interactive Parking Map & Route
                                </h2>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Click any parking marker or card &quot;View Route&quot; to inspect distance, driving duration & turn-by-turn directions.
                            </p>
                        </div>

                        {focusedParking && (
                            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 px-4 py-2 rounded-2xl text-xs font-semibold text-orange-700 dark:text-orange-300">
                                <span>Showing route to: <strong>{focusedParking.name}</strong></span>
                                <button
                                    onClick={() => setFocusedParking(null)}
                                    className="p-1 hover:bg-orange-200/50 rounded-full transition ml-1"
                                    title="Clear focused route"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>

                    <MapErrorBoundary parkings={sortedParkings} userLocation={userLocation}>
                        <ParkingMap
                            parkings={sortedParkings}
                            focusedParking={focusedParking}
                            userLocation={userLocation}
                        />
                    </MapErrorBoundary>
                </div>
            </div>
        </>
    );
}

export default Home;
