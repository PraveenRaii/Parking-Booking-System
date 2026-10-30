const { GoogleGenAI } = require("@google/genai");

let ai = null;
if (process.env.GEMINI_API_KEY) {
    try {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    } catch (e) {
        console.log("Failed to initialize GoogleGenAI:", e.message);
    }
}

// Fallback intelligent responses for ParkEase
const getSmartFallback = (message = "") => {
    const q = message.toLowerCase();
    if (q.includes("book") || q.includes("reserve") || q.includes("slot")) {
        return "To book a parking slot on ParkEase:\n1. Choose your preferred parking location from the home page or map.\n2. Click 'View Details' and then 'Book Now'.\n3. Select your vehicle type, enter your vehicle number, entry and exit times.\n4. Click 'Calculate Price' and proceed to payment!";
    }
    if (q.includes("cancel") || q.includes("cancellation")) {
        return "To cancel a booking, go to 'My Bookings' from the top navigation bar. If your booking is still pending or eligible for cancellation, click on 'Cancel Booking' to initiate a refund.";
    }
    if (q.includes("pay") || q.includes("price") || q.includes("upi") || q.includes("card")) {
        return "ParkEase supports multiple convenient payment methods including UPI, Credit/Debit cards, and Cash on arrival. Hourly rates vary by parking location and vehicle type.";
    }
    if (q.includes("refund")) {
        return "Refunds for cancelled bookings are credited back to the original payment source within 3-5 business days.";
    }
    if (q.includes("navigate") || q.includes("map") || q.includes("direction") || q.includes("route")) {
        return "You can use our interactive Parking Map on the home page. Click on any parking marker and tap 'Get Directions' to open turn-by-turn navigation in Google Maps!";
    }
    if (q.includes("login") || q.includes("signup") || q.includes("account") || q.includes("register")) {
        return "You can create a new account or log in via the Login/Signup links in the top navigation bar. Once logged in, you can manage your bookings, save favorite spots, and update your profile.";
    }
    return "👋 Hello! I am your ParkEase AI Assistant. You can ask me questions about booking parking slots, prices, navigation, cancellations, refunds, and managing your account.";
};

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.json({ reply: "Please enter a question so I can assist you." });
        }

        if (ai && process.env.GEMINI_API_KEY) {
            try {
                const prompt = `
You are ParkEase AI Assistant, a friendly and helpful assistant for the ParkEase parking booking platform.

Only answer questions related to:
- Parking Booking & Slots
- Payment, Pricing & Hourly rates
- Booking Cancellation & Refunds
- User Profile, Login & Signup
- Navigation & Directions to parking spots
- ParkEase Application Features

If the question is completely unrelated to parking or ParkEase, reply:
"I can only help with ParkEase services."

User question:
${message}
`;

                const generatePromise = ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: prompt,
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("AI generation timeout")), 5000)
                );

                const response = await Promise.race([generatePromise, timeoutPromise]);

                if (response && response.text) {
                    return res.json({
                        reply: response.text,
                    });
                }
            } catch (apiError) {
                console.log("Gemini API call timed out or failed, using intelligent fallback:", apiError.message);
            }
        }

        // Return smart fallback if Gemini API is unavailable or throws
        return res.json({
            reply: getSmartFallback(message)
        });

    } catch (err) {
        console.log("askAI error:", err);
        res.json({
            reply: getSmartFallback(req.body?.message)
        });
    }
};
