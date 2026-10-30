import axios from "axios";

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
            return "http://localhost:5000/api";
        }
    }
    return "https://parking-booking-system-pe0t.onrender.com/api";
};

const API = axios.create({
    baseURL: getBaseUrl()
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const msg = error.response.data?.message || "";
            if (msg.includes("Token") || msg.includes("Access Denied")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                if (typeof window !== "undefined" && !window.location.pathname.toLowerCase().includes("login")) {
                    alert("Your session has expired or is invalid. Please log in again to continue.");
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;
