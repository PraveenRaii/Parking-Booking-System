import { useEffect, useState, useCallback, useRef } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    DirectionsRenderer,
    useJsApiLoader
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { calculateDistanceKm, estimateDrivingTime, getDirectionsUrl } from "../services/distance";
import { FaRoute, FaDirections, FaLocationArrow, FaTimes, FaMapMarkedAlt } from "react-icons/fa";

const containerStyle = {
    width: "100%",
    height: "560px",
    borderRadius: "24px"
};

function ParkingMap({ parkings = [], focusedParking = null, userLocation = null }) {
    const navigate = useNavigate();
    const mapRef = useRef(null);

    const [selected, setSelected] = useState(null);
    const [directions, setDirections] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey
    });

    const calculateRoute = useCallback((destParking) => {
        if (!destParking || !destParking.location?.coordinates) return;

        const destLat = Number(destParking.location.coordinates[1]);
        const destLng = Number(destParking.location.coordinates[0]);

        if (isNaN(destLat) || isNaN(destLng)) return;

        // Default user location if GPS is unavailable
        const originCoords = userLocation || { lat: 28.6139, lng: 77.2090 };

        // Precompute accurate distance and estimated time
        const distKm = calculateDistanceKm(originCoords.lat, originCoords.lng, destLat, destLng);
        const estTime = estimateDrivingTime(distKm);

        setRouteInfo({
            parkingName: destParking.name,
            parkingAddress: destParking.address,
            distance: `${distKm} km`,
            duration: estTime,
            destLat,
            destLng
        });

        // Check if DirectionsService is available as a valid constructor
        const canUseDirections =
            typeof window !== "undefined" &&
            window.google &&
            window.google.maps &&
            typeof window.google.maps.DirectionsService === "function";

        if (canUseDirections) {
            try {
                setRouteLoading(true);
                const directionsService = new window.google.maps.DirectionsService();

                directionsService.route(
                    {
                        origin: originCoords,
                        destination: { lat: destLat, lng: destLng },
                        travelMode: window.google.maps.TravelMode.DRIVING
                    },
                    (result, status) => {
                        setRouteLoading(false);
                        if (status === "OK" && result) {
                            setDirections(result);
                            const leg = result.routes?.[0]?.legs?.[0];
                            if (leg) {
                                setRouteInfo((prev) => ({
                                    ...prev,
                                    distance: leg.distance?.text || prev?.distance,
                                    duration: leg.duration?.text || prev?.duration
                                }));
                            }
                        }
                    }
                );
            } catch (err) {
                console.log("DirectionsService error:", err.message);
                setRouteLoading(false);
            }
        }
    }, [userLocation]);

    // Whenever focusedParking changes
    useEffect(() => {
        if (focusedParking) {
            setSelected(focusedParking);
            calculateRoute(focusedParking);
            if (mapRef.current && focusedParking.location?.coordinates) {
                try {
                    mapRef.current.panTo({
                        lat: Number(focusedParking.location.coordinates[1]),
                        lng: Number(focusedParking.location.coordinates[0])
                    });
                    mapRef.current.setZoom(13);
                } catch {
                    // Ignore pan errors during map initialization
                }
            }
        }
    }, [focusedParking, calculateRoute]);

    const handleMarkerClick = (parking) => {
        setSelected(parking);
        calculateRoute(parking);
    };

    const clearRoute = () => {
        setDirections(null);
        setRouteInfo(null);
        setSelected(null);
    };

    const mapCenter = userLocation || {
        lat: 28.6139,
        lng: 77.2090
    };

    const validParkings = parkings.filter(
        (p) =>
            p?.location?.coordinates &&
            Array.isArray(p.location.coordinates) &&
            p.location.coordinates.length === 2 &&
            !isNaN(p.location.coordinates[0]) &&
            !isNaN(p.location.coordinates[1])
    );

    // If Google Maps failed to load or key is invalid, show rich route fallback
    if (loadError) {
        const target = focusedParking || validParkings[0];
        const coords = target?.location?.coordinates;
        const targetLat = coords ? Number(coords[1]) : 28.6139;
        const targetLng = coords ? Number(coords[0]) : 77.2090;
        const distKm = calculateDistanceKm(mapCenter.lat, mapCenter.lng, targetLat, targetLng);
        const estTime = estimateDrivingTime(distKm);

        return (
            <div className="rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-orange-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-100 dark:bg-orange-950/60 text-orange-600 rounded-2xl text-2xl">
                            <FaMapMarkedAlt />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {target ? target.name : "Interactive Parking Map"}
                            </h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                                {target?.address ? `${target.address}, ${target.city}` : "Driving Route & Navigation"}
                            </p>
                        </div>
                    </div>

                    <a
                        href={getDirectionsUrl(targetLat, targetLng, userLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md shadow-orange-500/20 text-sm transition"
                    >
                        <FaDirections />
                        <span>Open Turn-by-Turn GPS Navigation</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-orange-50/70 dark:bg-slate-900/60 rounded-2xl border border-orange-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-orange-600 uppercase">Driving Distance</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {distKm !== null ? `${distKm} km` : "Calculated from your location"}
                        </p>
                    </div>

                    <div className="p-4 bg-amber-50/70 dark:bg-slate-900/60 rounded-2xl border border-amber-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-amber-600 uppercase">Estimated Travel Time</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {estTime !== null ? `~${estTime}` : "City driving speed"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-96 rounded-3xl bg-orange-50 dark:bg-slate-800 flex flex-col items-center justify-center text-orange-600 font-semibold border border-orange-200 dark:border-slate-700 p-8 text-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p>Loading Interactive Map & Route Services...</p>
            </div>
        );
    }

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-orange-200 dark:border-slate-700">
            {/* Live Floating Route Overlay */}
            {routeInfo && (
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-orange-500 text-slate-800 dark:text-white animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md">
                                <FaRoute />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Driving Route</span>
                                <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white truncate max-w-[210px]">
                                    {routeInfo.parkingName}
                                </h4>
                            </div>
                        </div>

                        <button
                            onClick={clearRoute}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Close Route"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                        <div className="bg-orange-50 dark:bg-orange-950/40 p-2 rounded-xl border border-orange-100 dark:border-orange-900/50">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                            <span className="font-black text-lg text-orange-600 dark:text-orange-400">
                                {routeInfo.distance}
                            </span>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-100 dark:border-amber-900/50">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Driving Time</span>
                            <span className="font-black text-lg text-amber-600 dark:text-amber-400">
                                {routeLoading ? "Calculating..." : routeInfo.duration}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <a
                            href={getDirectionsUrl(routeInfo.destLat, routeInfo.destLng, userLocation)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-3 rounded-xl shadow-md shadow-orange-500/20 text-xs text-center flex items-center justify-center gap-1.5 transition"
                        >
                            <FaDirections />
                            <span>Start Navigation</span>
                        </a>

                        {selected?._id && (
                            <button
                                onClick={() => navigate(`/parking/${selected._id}`)}
                                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-3 rounded-xl text-xs transition"
                            >
                                Book Spot
                            </button>
                        )}
                    </div>
                </div>
            )}

            <GoogleMap
                onLoad={(map) => { mapRef.current = map; }}
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true
                }}
            >
                {/* User Current Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="Your Location"
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                    />
                )}

                {/* Parking Spots Markers */}
                {validParkings.map((parking) => (
                    <Marker
                        key={parking._id}
                        position={{
                            lat: Number(parking.location.coordinates[1]),
                            lng: Number(parking.location.coordinates[0])
                        }}
                        onClick={() => handleMarkerClick(parking)}
                        icon={{
                            url: selected?._id === parking._id
                                ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }}
                    />
                ))}

                {/* Driving Route Polyline */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            polylineOptions: {
                                strokeColor: "#ea580c",
                                strokeWeight: 6,
                                strokeOpacity: 0.9
                            },
                            suppressMarkers: false
                        }}
                    />
                )}

                {/* Info Window on Click */}
                {selected && selected.location?.coordinates && (
                    <InfoWindow
                        position={{
                            lat: Number(selected.location.coordinates[1]),
                            lng: Number(selected.location.coordinates[0])
                        }}
                        onCloseClick={() => setSelected(null)}
                    >
                        <div className="w-64 p-1 text-slate-800">
                            {selected.image && (
                                <img
                                    src={selected.image}
                                    alt={selected.name}
                                    className="rounded-xl w-full h-28 object-cover mb-2"
                                />
                            )}
                            <h3 className="font-bold text-base text-slate-900 leading-tight">
                                {selected.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{selected.address}</p>

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                                <span className="text-orange-600 font-extrabold text-sm">
                                    ₹{selected.price} / hr
                                </span>
                                <span className="text-xs font-semibold text-emerald-600">
                                    {selected.availableSlots} slots left
                                </span>
                            </div>

                            {userLocation && (
                                <div className="mt-2 p-2 bg-orange-50 rounded-lg text-xs flex items-center justify-between font-semibold text-orange-800">
                                    <span className="flex items-center gap-1">
                                        <FaLocationArrow className="text-orange-600" />
                                        <span>{calculateDistanceKm(userLocation.lat, userLocation.lng, selected.location.coordinates[1], selected.location.coordinates[0])} km away</span>
                                    </span>
                                    <span className="text-slate-500 text-[10px]">
                                        ~{estimateDrivingTime(calculateDistanceKm(userLocation.lat, userLocation.lng, selected.location.coordinates[1], selected.location.coordinates[0]))}
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <button
                                    onClick={() => navigate(`/parking/${selected._id}`)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-2 rounded-xl transition"
                                >
                                    Book Now
                                </button>
                                <button
                                    onClick={() => calculateRoute(selected)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-2 rounded-xl transition flex items-center justify-center gap-1"
                                >
                                    <FaRoute /> Route
                                </button>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}

export default ParkingMap;