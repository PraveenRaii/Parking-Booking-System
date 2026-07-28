const express = require("express");

const router = express.Router();

const { createBooking,
     getBookings,
     myBookings,
getAllBookings,
approveBooking,
rejectBooking
 } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/", getBookings);
//router.get("/my", myBookings);

router.get("/all", getAllBookings);

router.put("/approve/:id", approveBooking);

router.put("/reject/:id", rejectBooking);

module.exports = router;