require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"ParkEase" <${process.env.EMAIL_USER || "support@parkease.com"}>`,
            to,
            subject,
            html
        });

        console.log("Email sent successfully to:", to, "MessageId:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email Error:", error.message);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;
