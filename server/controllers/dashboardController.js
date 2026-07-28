const User = require("../models/User");
const Parking = require("../models/Parking");
const Booking = require("../models/Booking");

exports.getDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalParking = await Parking.countDocuments();

        const totalBookings = await Booking.countDocuments();

        const revenue = await Booking.aggregate([
            {
                $match: {
                    status: "Approved"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const availableSlots = await Parking.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$availableSlots"
                    }
                }
            }
        ]);

        const totalSlots = await Parking.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalSlots"
                    }
                }
            }
        ]);

        res.json({

            totalUsers,

            totalParking,

            totalBookings,

            revenue: revenue[0]?.total || 0,

            availableSlots: availableSlots[0]?.total || 0,

            occupiedSlots:
                (totalSlots[0]?.total || 0) -
                (availableSlots[0]?.total || 0)

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};