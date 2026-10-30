const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 600 // Automatically delete 10 minutes after creation (TTL index)
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
