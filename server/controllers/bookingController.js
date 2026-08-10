const Booking = require("../models/Booking");
const Parking = require("../models/Parking");
const User = require("../models/User");
const sendEmail = require("../utils/email");

// GET USER BOOKINGS

exports.getBookings = async (req, res) => {

    try {

       

        const bookings = await Booking
            .find({
                user: req.user.id
            })
            .populate("parking");

      

        res.json(bookings);

    } catch (err) {

       
        res.status(500).json({
            message: err.message
        });

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

      

        const parking = await Parking.findById(
            savedBooking.parking
        );


        // BOOKING EMAIL

        if (user && user.email) {

           

            await sendEmail(
                user.email,
                "ParkEase - Booking Confirmation",
                `
                <div style="
                    font-family: Arial;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                ">

                    <h1 style="color:#2563eb;">
                        ParkEase
                    </h1>

                    <h2>
                        Booking Successful 🚗
                    </h2>

                    <p>
                        Hello ${user.name || "User"},
                    </p>

                    <p>
                        Your parking booking has been successfully created.
                    </p>

                    <hr>

                    <p>
                        <strong>Parking:</strong>
                        ${parking?.name || "Parking"}
                    </p>

                    <p>
                        <strong>Vehicle:</strong>
                        ${savedBooking.vehicleNumber}
                    </p>

                    <p>
                        <strong>Vehicle Type:</strong>
                        ${savedBooking.vehicleType}
                    </p>

                    <p>
                        <strong>Entry:</strong>
                        ${savedBooking.entryDate}
                        ${savedBooking.entryTime}
                    </p>

                    <p>
                        <strong>Exit:</strong>
                        ${savedBooking.exitDate}
                        ${savedBooking.exitTime}
                    </p>

                    <p>
                        <strong>Total Hours:</strong>
                        ${savedBooking.totalHours}
                    </p>

                    <h2>
                        Total Amount:
                        ₹${savedBooking.totalAmount}
                    </h2>

                    <p>
                        <strong>Status:</strong>
                        Pending
                    </p>

                    <hr>

                    <p>
                        Thank you for using ParkEase.
                    </p>

                </div>
                `
            );

           

        } else {

            console.log("NO USER EMAIL FOUND");

        }

        // SOCKET.IO
   

        const io = req.app.get("io");

        if (io && parking) {

            io.emit("slotUpdated", {

                parkingId: parking._id,

                availableSlots:
                    parking.availableSlots

            });

        }

        // RESPONSE
   

        res.status(201).json({

            message: "Booking Successful",

            booking: savedBooking

        });


    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

     

// GET ALL BOOKINGS - ADMIN
exports.getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking
            .find()
            .populate("parking")
            .populate("user", "-password");

        res.json(bookings);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// APPROVE BOOKING
exports.approveBooking = async (req, res) => {

    try {

        const booking = await Booking
            .findById(req.params.id)
            .populate("user")
            .populate("parking");


      


        if (!booking) {

            return res.status(404).json({
                message: "Booking Not Found"
            });

        }


        booking.status = "Approved";

        await booking.save();


        const parking = await Parking.findByIdAndUpdate(
            booking.parking._id,
            {
                $inc: {
                    availableSlots: -1
                }
            },
            {
               returnDocument: "after"
            }
        );


        // Socket
        const io = req.app.get("io");

        if (io && parking) {

            io.emit("slotUpdated", {
                parkingId: parking._id,
                availableSlots: parking.availableSlots
            });

        }


        // Approval Email
        if (booking.user && booking.user.email) {

            await sendEmail(
                booking.user.email,
                "ParkEase - Booking Approved",
                `
                <h2 style="color:green;">
                    Booking Approved ✅
                </h2>

                <p>
                    Hello ${booking.user.name || "User"},
                </p>

                <p>
                    Your parking booking has been approved.
                </p>

                <p>
                    <strong>Parking:</strong>
                    ${booking.parking?.name || "Parking"}
                </p>

                <p>
                    <strong>Vehicle:</strong>
                    ${booking.vehicleNumber}
                </p>

                <p>
                    <strong>Entry:</strong>
                    ${booking.entryDate} ${booking.entryTime}
                </p>

                <p>
                    <strong>Exit:</strong>
                    ${booking.exitDate} ${booking.exitTime}
                </p>

                <h3>
                    Total Amount: ₹${booking.totalAmount}
                </h3>

                <p>
                    <strong>Status:</strong> Approved
                </p>
                `
            );

           

        } else {

            console.log("NO USER EMAIL FOUND");

        }


        res.json({
            message: "Booking Approved"
        });


    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};

// REJECT BOOKING

exports.rejectBooking = async (req, res) => {

    try {

        const booking = await Booking
            .findById(req.params.id)
            .populate("user")
            .populate("parking");


        if (!booking) {

            return res.status(404).json({

                message: "Booking Not Found"

            });

        }


        // Prevent rejecting already rejected booking

        if (booking.status === "Rejected") {

            return res.status(400).json({

                message: "Booking Already Rejected"

            });

        }


        booking.status = "Rejected";

        await booking.save();



        // REJECTED EMAIL
    
        if (booking.user && booking.user.email) {

            await sendEmail(

                booking.user.email,

                "ParkEase - Booking Rejected ❌",

                `
                <div style="
                    font-family: Arial;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">

                    <h1 style="color:#2563eb;">
                        ParkEase
                    </h1>

                    <h2 style="color:#dc2626;">
                        Booking Rejected ❌
                    </h2>

                    <p>
                        Hello ${booking.user.name || "User"},
                    </p>

                    <p>
                        Unfortunately, your parking booking has been rejected.
                    </p>

                    <hr>

                    <p>
                        <strong>Parking:</strong>
                        ${booking.parking?.name || "Parking"}
                    </p>

                    <p>
                        <strong>Vehicle Number:</strong>
                        ${booking.vehicleNumber}
                    </p>

                    <p>
                        <strong>Vehicle Type:</strong>
                        ${booking.vehicleType}
                    </p>

                    <p>
                        <strong>Entry:</strong>
                        ${booking.entryDate} ${booking.entryTime}
                    </p>

                    <p>
                        <strong>Exit:</strong>
                        ${booking.exitDate} ${booking.exitTime}
                    </p>

                    <p>
                        <strong>Total Amount:</strong>
                        ₹${booking.totalAmount}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        Rejected
                    </p>

                    <hr>

                    <p>
                        Please try booking another available parking space.
                    </p>

                    <p>
                        Thank you for using ParkEase.
                    </p>

                </div>
                `
            );

        }


        res.json({

            message: "Booking Rejected"

        });


    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};