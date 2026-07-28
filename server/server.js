const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const parkingRoutes=require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

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

app.listen(PORT,()=>{

    console.log(`Server Running on ${PORT}`);

});