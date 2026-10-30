/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const nLat1 = Number(lat1);
    const nLon1 = Number(lon1);
    const nLat2 = Number(lat2);
    const nLon2 = Number(lon2);

    if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

    const R = 6371; // Earth radius in km
    const dLat = (nLat2 - nLat1) * (Math.PI / 180);
    const dLon = (nLon2 - nLon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(nLat1 * (Math.PI / 180)) *
        Math.cos(nLat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
};

/**
 * Estimate driving time based on average city driving speed (28 km/h)
 */
export const estimateDrivingTime = (distanceKm) => {
    if (!distanceKm || isNaN(distanceKm)) return null;
    const minutes = Math.max(2, Math.round((distanceKm / 28) * 60));

    if (minutes < 60) {
        return `${minutes} mins driving`;
    }
    const hrs = Math.floor(minutes / 60);
    const remMins = minutes % 60;
    return remMins > 0 ? `${hrs} hr ${remMins} mins` : `${hrs} hr driving`;
};

/**
 * Generate official Google Maps Turn-by-Turn Driving Navigation Link
 */
export const getDirectionsUrl = (destLat, destLng, userLocation = null) => {
    if (!destLat || !destLng) return "#";
    if (userLocation && userLocation.lat && userLocation.lng) {
        return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
};
