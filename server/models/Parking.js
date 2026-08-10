const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        image: {
            type: String
        },

        price: {
            type: Number,
            required: true
        },

        totalSlots: {
            type: Number,
            required: true
        },

        availableSlots: {
            type: Number,
            required: true
        },

        rating: {
            type: Number,
            default: 4.5
        },

        totalReviews: {
            type: Number,
            default: 0
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

parkingSchema.index({
    location: "2dsphere"
});

module.exports = mongoose.model("Parking", parkingSchema);