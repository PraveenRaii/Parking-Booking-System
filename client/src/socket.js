import { io } from "socket.io-client";

const socket = io("https://parking-booking-system-pe0t.onrender.com");

export default socket;