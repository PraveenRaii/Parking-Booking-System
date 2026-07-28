const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;

        const prompt = `
You are ParkEase AI Assistant.

Only answer questions related to:
- Parking Booking
- Parking Slots
- Payment
- Booking
- Refund
- Cancellation
- Profile
- Login
- Signup
- Navigation
- ParkEase Application

If the question is unrelated, reply:
"I can only help with ParkEase services."

User:
${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        res.json({
            reply: response.text,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            reply: "AI is currently unavailable."
        });
    }
};