const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const sendEmail = require("./utils/email");
const server = http.createServer(app);
const parkingRoutes=require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes=require("./routes/authRoutes");

app.use("/api/auth",authRoutes);
app.use("/api/parking",parkingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
require("dotenv").config();



app.get("/",(req,res)=>{

    res.send("Backend Running");

});


mongoose.connect(process.env.MONGO_URL)
.then(()=>{

    console.log("MongoDB Connected");

})
.catch(err=>{

    console.log(err);

});

const PORT=process.env.PORT || 5000;


app.get("/test-email", async (req, res) => {

    await sendEmail(
        "your-email@gmail.com",
        "ParkEase Email Test",
        `
        <h1>ParkEase</h1>
        <p>Email notification successfully working! 🚗</p>
        `
    );

    res.json({
        message: "Test email sent"
    });

});
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
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