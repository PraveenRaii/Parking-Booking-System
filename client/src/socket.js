import { io } from "socket.io-client";

const getSocketUrl = () => {
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://localhost:5000";
        }
    }
    return "https://parking-booking-system-pe0t.onrender.com";
};

const socket = io(getSocketUrl(), {
    autoConnect: true,
    reconnection: true
});

export default socket;
