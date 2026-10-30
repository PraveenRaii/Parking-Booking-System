import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { calculateDistanceKm, estimateDrivingTime, getDirectionsUrl } from "../services/distance";
import { FaRoute, FaDirections, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

function ParkingMap({ parkings = [], focusedParking = null, userLocation = null }) {
    const navigate = useNavigate();
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);
    const routeLayerRef = useRef(null);

    const [selectedParking, setSelectedParking] = useState(null);

    const effectiveUserLocation = useMemo(() => {
        return userLocation || { lat: 28.6139, lng: 77.2090 };
    }, [userLocation]);

    // Filter valid parkings with coordinates
    const validParkings = useMemo(() => {
        return (parkings || []).filter(
            (p) =>
                p?.location?.coordinates &&
                Array.isArray(p.location.coordinates) &&
                p.location.coordinates.length === 2 &&
                !isNaN(p.location.coordinates[0]) &&
                !isNaN(p.location.coordinates[1])
        );
    }, [parkings]);

    // Compute route info for focused parking or selected parking
    const activeRouteParking = focusedParking || selectedParking;
    const routeInfo = useMemo(() => {
        if (!activeRouteParking?.location?.coordinates) return null;
        const destLat = Number(activeRouteParking.location.coordinates[1]);
        const destLng = Number(activeRouteParking.location.coordinates[0]);
        if (isNaN(destLat) || isNaN(destLng)) return null;

        const distKm = calculateDistanceKm(
            effectiveUserLocation.lat,
            effectiveUserLocation.lng,
            destLat,
            destLng
        );
        const eta = estimateDrivingTime(distKm);

        return {
            name: activeRouteParking.name,
            address: activeRouteParking.address,
            price: activeRouteParking.price,
            slots: activeRouteParking.availableSlots,
            id: activeRouteParking._id,
            distKm,
            eta,
            destLat,
            destLng,
            navUrl: getDirectionsUrl(destLat, destLng, userLocation)
        };
    }, [activeRouteParking, effectiveUserLocation, userLocation]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // If map is already initialized, don't recreate
        if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            return;
        }

        const map = L.map(mapContainerRef.current, {
            center: [effectiveUserLocation.lat, effectiveUserLocation.lng],
            zoom: 12,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add OpenStreetMap tile layer (Free, no API key needed, never fails)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        routeLayerRef.current = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [effectiveUserLocation]);

    // Update markers and route whenever parkings, userLocation, or focusedParking changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !markersLayerRef.current || !routeLayerRef.current) return;

        markersLayerRef.current.clearLayers();
        routeLayerRef.current.clearLayers();

        // 1. Add User Location Marker
        if (userLocation && userLocation.lat && userLocation.lng) {
            const userIcon = L.divIcon({
                className: "custom-user-marker",
                html: `
                    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="position: absolute; width: 32px; height: 32px; background: rgba(59, 130, 246, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                        <div style="width: 22px; height: 22px; background: #2563eb; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">📍</div>
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .bindPopup("<div style='font-weight: bold; font-size: 12px; color: #1e293b; padding: 2px;'>📍 Your Current Location</div>")
                .addTo(markersLayerRef.current);
        }

        // 2. Add Parking Spots Markers
        const bounds = [];
        if (userLocation?.lat && userLocation?.lng) {
            bounds.push([userLocation.lat, userLocation.lng]);
        }

        validParkings.forEach((parking) => {
            const lat = Number(parking.location.coordinates[1]);
            const lng = Number(parking.location.coordinates[0]);
            bounds.push([lat, lng]);

            const isFocused = (focusedParking && focusedParking._id === parking._id) || (selectedParking && selectedParking._id === parking._id);

            const parkingIcon = L.divIcon({
                className: "custom-parking-marker",
                html: `
                    <div style="
                        background: ${isFocused ? "linear-gradient(135deg, #ea580c, #b45309)" : "linear-gradient(135deg, #f97316, #fb923c)"};
                        width: ${isFocused ? "40px" : "34px"};
                        height: ${isFocused ? "40px" : "34px"};
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 4px 14px rgba(234, 88, 12, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 900;
                        font-size: ${isFocused ? "18px" : "15px"};
                        cursor: pointer;
                        transform: ${isFocused ? "scale(1.15)" : "scale(1)"};
                        transition: transform 0.2s ease;
                    ">
                        🚗
                    </div>
                `,
                iconSize: isFocused ? [40, 40] : [34, 34],
                iconAnchor: isFocused ? [20, 20] : [17, 17]
            });

            const marker = L.marker([lat, lng], { icon: parkingIcon }).addTo(markersLayerRef.current);

            // Calculate distance for popup
            const dist = calculateDistanceKm(effectiveUserLocation.lat, effectiveUserLocation.lng, lat, lng);
            const time = estimateDrivingTime(dist);

            marker.on("click", () => {
                setSelectedParking(parking);
            });

            marker.bindPopup(`
                <div style="font-family: inherit; width: 200px; padding: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                        <span style="font-weight: 800; font-size: 13px; color: #0f172a;">${parking.name}</span>
                    </div>
                    <p style="color: #64748b; font-size: 11px; margin: 0 0 6px;">${parking.address || parking.city}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid #f1f5f9; margin-bottom: 6px;">
                        <span style="color: #ea580c; font-weight: 800; font-size: 13px;">₹${parking.price} <span style="font-size: 10px; font-weight: normal; color: #64748b;">/hr</span></span>
                        <span style="font-size: 11px; font-weight: 600; color: #059669;">${parking.availableSlots} free</span>
                    </div>
                    ${dist !== null ? `<div style="background: #fff7ed; padding: 4px 6px; border-radius: 8px; font-size: 10px; font-weight: 700; color: #c2410c; margin-bottom: 6px;">📍 ${dist} km (~${time})</div>` : ""}
                    <div style="display: flex; gap: 4px;">
                        <a href="/parking/${parking._id}" style="flex: 1; text-align: center; background: #ea580c; color: white; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none;">Book</a>
                        <a href="${getDirectionsUrl(lat, lng, userLocation)}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0f172a; color: white; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: bold; text-decoration: none;">Route</a>
                    </div>
                </div>
            `);
        });

        // 3. Draw Route Polyline if focused or selected
        if (activeRouteParking?.location?.coordinates) {
            const destLat = Number(activeRouteParking.location.coordinates[1]);
            const destLng = Number(activeRouteParking.location.coordinates[0]);

            if (!isNaN(destLat) && !isNaN(destLng)) {
                // Route polyline with dashed style
                const latlngs = [
                    [effectiveUserLocation.lat, effectiveUserLocation.lng],
                    [destLat, destLng]
                ];

                const routeLine = L.polyline(latlngs, {
                    color: "#ea580c",
                    weight: 5,
                    opacity: 0.9,
                    dashArray: "8, 8"
                }).addTo(routeLayerRef.current);

                map.fitBounds(routeLine.getBounds(), { padding: [60, 60], maxZoom: 14 });
            }
        } else if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        }
    }, [validParkings, userLocation, focusedParking, selectedParking, effectiveUserLocation, activeRouteParking]);

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-orange-200 dark:border-slate-700">
            {/* Live Floating Route Card */}
            {routeInfo && (
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-orange-500 text-slate-800 dark:text-white animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-xl shadow-md text-sm">
                                <FaRoute />
                            </span>
                            <div>
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Driving Route</span>
                                <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white truncate max-w-[210px]">
                                    {routeInfo.name}
                                </h4>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedParking(null);
                                if (routeLayerRef.current) routeLayerRef.current.clearLayers();
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Close Route"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                        <div className="bg-orange-50 dark:bg-orange-950/40 p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/50">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                            <span className="font-black text-lg text-orange-600 dark:text-orange-400">
                                {routeInfo.distKm !== null ? `${routeInfo.distKm} km` : "Nearby"}
                            </span>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/50">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Drive Time</span>
                            <span className="font-black text-lg text-amber-600 dark:text-amber-400">
                                {routeInfo.eta || "~10 mins"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <a
                            href={routeInfo.navUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-3 rounded-xl shadow-md shadow-orange-500/20 text-xs text-center flex items-center justify-center gap-1.5 transition"
                        >
                            <FaDirections />
                            <span>Start Navigation</span>
                        </a>

                        {routeInfo.id && (
                            <button
                                type="button"
                                onClick={() => navigate(`/parking/${routeInfo.id}`)}
                                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                            >
                                Book Spot
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State Banner if 0 Parkings */}
            {validParkings.length === 0 && (
                <div className="absolute bottom-4 left-4 right-4 z-[999] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-orange-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500" />
                    <span>Map centered on Delhi NCR. Connect database to display live parking spots.</span>
                </div>
            )}

            {/* Leaflet Map Div */}
            <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "560px", zIndex: 1 }}
                className="bg-slate-100 dark:bg-slate-800"
            />
        </div>
    );
}

export default ParkingMap;