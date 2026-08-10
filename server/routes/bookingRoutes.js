const express = require("express");

const router = express.Router();

const {
    createBooking,
    getBookings,
    myBookings,
    getAllBookings,
    approveBooking,
    rejectBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// USER BOOKING ROUTES

router.post("/", authMiddleware, createBooking);

router.get("/", authMiddleware, getBookings);
// ADMIN BOOKING ROUTES

router.get("/all", getAllBookings);

router.put("/approve/:id", approveBooking);

router.put("/reject/:id", rejectBooking);


module.exports = router;