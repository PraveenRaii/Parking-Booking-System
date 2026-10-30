const Booking = require("../models/Booking");
const Parking = require("../models/Parking");
const User = require("../models/User");
const sendEmail = require("../utils/email");

// GET USER BOOKINGS
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("parking")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE BOOKING
exports.createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            user: req.user.id
        };

        const savedBooking = await Booking.create(bookingData);
        const user = await User.findById(savedBooking.user);
        const parking = await Parking.findById(savedBooking.parking);

        // BOOKING EMAIL (non-blocking)
        if (user && user.email) {
            sendEmail(
                user.email,
                "ParkEase - Booking Confirmation",
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f97316; border-radius: 10px;">
                    <h1 style="color:#ea580c;">ParkEase 🚗</h1>
                    <h2>Booking Successful!</h2>
                    <p>Hello ${user.name || "Valued User"},</p>
                    <p>Your parking booking has been successfully created.</p>
                    <hr style="border: 0.5px solid #eee;">
                    <p><strong>Parking:</strong> ${parking?.name || "Parking Space"}</p>
                    <p><strong>Vehicle:</strong> ${savedBooking.vehicleNumber} (${savedBooking.vehicleType})</p>
                    <p><strong>Entry:</strong> ${savedBooking.entryDate} ${savedBooking.entryTime}</p>
                    <p><strong>Exit:</strong> ${savedBooking.exitDate} ${savedBooking.exitTime}</p>
                    <p><strong>Total Hours:</strong> ${savedBooking.totalHours} hrs</p>
                    <h2 style="color:#ea580c;">Total Amount: ₹${savedBooking.totalAmount}</h2>
                    <p><strong>Status:</strong> Pending Approval</p>
                    <hr style="border: 0.5px solid #eee;">
                    <p>Thank you for choosing ParkEase.</p>
                </div>
                `
            ).catch(e => console.log("Email error:", e.message));
        }

        // SOCKET.IO
        const io = req.app.get("io");
        if (io && parking) {
            io.emit("slotUpdated", {
                parkingId: parking._id,
                availableSlots: parking.availableSlots
            });
        }

        res.status(201).json({
            message: "Booking Successful",
            booking: savedBooking
        });

    } catch (err) {
        console.log("createBooking error:", err);
        res.status(500).json({ message: err.message });
    }
};

// GET ALL BOOKINGS - ADMIN
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("parking")
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.log("getAllBookings error:", err);
        res.status(500).json({ message: err.message });
    }
};

// APPROVE BOOKING
exports.approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user")
            .populate("parking");

        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" });
        }

        booking.status = "Approved";
        await booking.save();

        let parking = null;
        if (booking.parking && booking.parking._id) {
            parking = await Parking.findByIdAndUpdate(
                booking.parking._id,
                { $inc: { availableSlots: -1 } },
                { new: true }
            );
        }

        // Socket
        const io = req.app.get("io");
        if (io && parking) {
            io.emit("slotUpdated", {
                parkingId: parking._id,
                availableSlots: parking.availableSlots
            });
        }

        // Approval Email (non-blocking)
        if (booking.user && booking.user.email) {
            sendEmail(
                booking.user.email,
                "ParkEase - Booking Approved ✅",
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #16a34a; border-radius: 10px;">
                    <h2 style="color:#16a34a;">Booking Approved ✅</h2>
                    <p>Hello ${booking.user.name || "Valued User"},</p>
                    <p>Your parking booking has been officially approved!</p>
                    <p><strong>Parking:</strong> ${booking.parking?.name || "Parking"}</p>
                    <p><strong>Vehicle:</strong> ${booking.vehicleNumber}</p>
                    <p><strong>Entry:</strong> ${booking.entryDate} ${booking.entryTime}</p>
                    <p><strong>Exit:</strong> ${booking.exitDate} ${booking.exitTime}</p>
                    <h3 style="color:#ea580c;">Total Amount: ₹${booking.totalAmount}</h3>
                    <p><strong>Status:</strong> Approved</p>
                </div>
                `
            ).catch(e => console.log("Email error:", e.message));
        }

        res.json({ message: "Booking Approved", booking });

    } catch (err) {
        console.log("approveBooking error:", err);
        res.status(500).json({ message: err.message });
    }
};

// REJECT BOOKING
exports.rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user")
            .populate("parking");

        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" });
        }

        if (booking.status === "Rejected") {
            return res.status(400).json({ message: "Booking Already Rejected" });
        }

        booking.status = "Rejected";
        await booking.save();

        if (booking.user && booking.user.email) {
            sendEmail(
                booking.user.email,
                "ParkEase - Booking Rejected ❌",
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dc2626; border-radius: 10px;">
                    <h1 style="color:#ea580c;">ParkEase</h1>
                    <h2 style="color:#dc2626;">Booking Rejected ❌</h2>
                    <p>Hello ${booking.user.name || "Valued User"},</p>
                    <p>Unfortunately, your parking booking for ${booking.parking?.name || "the spot"} could not be approved at this time.</p>
                    <p><strong>Vehicle:</strong> ${booking.vehicleNumber}</p>
                    <p><strong>Status:</strong> Rejected</p>
                    <hr style="border: 0.5px solid #eee;">
                    <p>Please check other available slots on ParkEase.</p>
                </div>
                `
            ).catch(e => console.log("Email error:", e.message));
        }

        res.json({ message: "Booking Rejected", booking });

    } catch (err) {
        console.log("rejectBooking error:", err);
        res.status(500).json({ message: err.message });
    }
};
