const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const sendEmail = require("./utils/email");
const seedDatabase = require("./utils/seed");

const app = express();
const server = http.createServer(app);

const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const defaultLocalMongo = "mongodb://127.0.0.1:27017/parkingbooking";
const envMongo = process.env.MONGO_URL || process.env.MONGO_URI;
const mongoUri = envMongo && !envMongo.includes("<db_username>")
    ? envMongo
    : defaultLocalMongo;

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
    .then(async () => {
        console.log("MongoDB Connected:", mongoUri.includes("127.0.0.1") ? "Local Database" : "Cloud Atlas");
        await seedDatabase();
    })
    .catch(err => {
        console.log("MongoDB Connection Error:", err.message);
        if (!mongoUri.includes("127.0.0.1")) {
            console.log("Connecting to local MongoDB fallback...");
            mongoose.connect(defaultLocalMongo)
                .then(async () => {
                    console.log("Connected to local MongoDB successfully!");
                    await seedDatabase();
                })
                .catch(e => console.log("Local fallback also failed:", e.message));
        }
    });

const PORT = process.env.PORT || 5000;

app.get("/test-email", async (req, res) => {
    await sendEmail(
        "your-email@gmail.com",
        "ParkEase Email Test",
        `
        <h1>ParkEase</h1>
        <p>Email notification successfully working! 🚗</p>
        `
    );
    res.json({ message: "Test email sent" });
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("User Connected :", socket.id);
    socket.on("disconnect", () => {
        console.log("User Disconnected :", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
