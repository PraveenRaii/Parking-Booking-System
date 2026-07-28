const Booking = require("../models/Booking");
const Parking = require("../models/Parking");

exports.getBookings = async (req, res) => {

    try {

        const bookings = await Booking
            .find()
            .populate("parking");

        res.json(bookings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.createBooking = async (req, res) => {

    try {

        const booking = await Booking.create(req.body);

        res.status(201).json({
            message: "Booking Successful",
            booking
        });

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("parking")
            .populate("user", "-password");

        res.json(bookings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
exports.approveBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking Not Found"
            });

        }

        booking.status = "Approved";

        await booking.save();

        await Parking.findByIdAndUpdate(
            booking.parking,
            {
                $inc: {
                    availableSlots: -1
                }
            }
        );

        res.json({
            message: "Booking Approved"
        });

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Reject Booking

exports.rejectBooking = async (req, res) => {

    try {

        await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status: "Rejected"
            }
        );

        res.json({
            message: "Booking Rejected"
        });

    }

    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};