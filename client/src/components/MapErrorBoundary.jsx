import React from "react";
import { FaRoute, FaDirections } from "react-icons/fa";
import { getDirectionsUrl } from "../services/distance";

class MapErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("MapErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const fallbackParking = this.props.parking || (this.props.parkings && this.props.parkings[0]);
            const coords = fallbackParking?.location?.coordinates;
            const destLat = Array.isArray(coords) ? coords[1] : null;
            const destLng = Array.isArray(coords) ? coords[0] : null;

            return (
                <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-orange-200 dark:border-slate-700 p-8 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl mb-4">
                        <FaRoute />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                        Interactive Map Preview
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mt-2">
                        {fallbackParking?.name ? `Driving directions to ${fallbackParking.name}` : "Map service is initializing."}
                    </p>

                    {destLat && destLng && (
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <a
                                href={getDirectionsUrl(destLat, destLng, this.props.userLocation)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-orange-500/20 text-sm transition"
                            >
                                <FaDirections />
                                <span>Open Turn-by-Turn Navigation</span>
                            </a>

                            <button
                                type="button"
                                onClick={() => this.setState({ hasError: false })}
                                className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                            >
                                Retry Map
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default MapErrorBoundary;