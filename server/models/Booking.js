const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    parking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parking",
        required: true
    },

    vehicleNumber: {
        type: String,
        required: true
    },

    vehicleType: {
        type: String,
        required: true
    },

    entryDate: String,
    entryTime: String,

    exitDate: String,
    exitTime: String,

    totalHours: Number,

    totalAmount: Number,

    status: {
        type: String,
        default: "Pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);