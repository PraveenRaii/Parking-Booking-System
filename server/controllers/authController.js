const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET || "parking123";

// Helper: Validate strong password
const validateStrongPassword = (password) => {
    if (!password || typeof password !== "string") {
        return { isValid: false, message: "Password is required" };
    }
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter (A-Z)" };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one lowercase letter (a-z)" };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number (0-9)" };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one special symbol (!@#$%...)" };
    }
    return { isValid: true };
};

// Send OTP to email for signup verification
exports.sendOtp = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Valid email address is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const exist = await User.findOne({ email: normalizedEmail });
        if (exist) {
            return res.status(400).json({
                message: "An account with this email already exists. Please log in instead."
            });
        }

        // Validate password strength if provided during OTP initiation
        if (password) {
            const pwdCheck = validateStrongPassword(password);
            if (!pwdCheck.isValid) {
                return res.status(400).json({ message: pwdCheck.message });
            }
        }

        // Generate 6-digit random code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP (replace any previous pending code for this email)
        await Otp.deleteMany({ email: normalizedEmail });
        await Otp.create({
            email: normalizedEmail,
            otp
        });

        // Send email with ParkEase branded HTML
        const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #ea580c; margin: 0; font-size: 28px; font-weight: 900;">🚗 ParkEase</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Smart Parking Reservation Platform</p>
            </div>
            <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; padding: 24px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #9a3412; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <h2 style="font-size: 40px; letter-spacing: 8px; color: #ea580c; margin: 14px 0; font-family: monospace; font-weight: 900;">${otp}</h2>
                <p style="margin: 0; font-size: 12px; color: #c2410c;">⏱️ Valid for 10 minutes</p>
            </div>
            <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
                Welcome to ParkEase! Enter this code on the registration page to verify your email and activate your account.
            </p>
            <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
                For security reasons, never share this code with anyone. ParkEase support will never ask for your verification code.
            </p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
                If you did not request this code, you can safely ignore this email.
            </p>
        </div>
        `;

        const emailResult = await sendEmail(
            normalizedEmail,
            `ParkEase Verification Code: ${otp}`,
            emailHtml
        );

        if (!emailResult.success) {
            console.warn("Nodemailer failed, returning fallback warning");
        }

        res.json({
            success: true,
            message: `Verification code sent to ${normalizedEmail}`
        });

    } catch (err) {
        console.error("sendOtp error:", err.message);
        res.status(500).json({
            message: "Failed to send verification code. Please try again."
        });
    }
};

// Register with OTP verification and strong password enforcement
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, otp } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Full name is required" });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Strong password check
        const pwdCheck = validateStrongPassword(password);
        if (!pwdCheck.isValid) {
            return res.status(400).json({ message: pwdCheck.message });
        }

        // Email already registered check
        const exist = await User.findOne({ email: normalizedEmail });
        if (exist) {
            return res.status(400).json({
                message: "An account with this email already exists. Please log in."
            });
        }

        // OTP verification check
        if (!otp || !String(otp).trim()) {
            return res.status(400).json({ message: "Please enter the 6-digit verification code sent to your email." });
        }

        const otpRecord = await Otp.findOne({
            email: normalizedEmail,
            otp: String(otp).trim()
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired verification code. Please check your email or request a new code."
            });
        }

        // Password hashing
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashPassword,
            phone: phone ? phone.trim() : ""
        });

        // Clean up OTP records
        await Otp.deleteMany({ email: normalizedEmail });

        // Generate JWT token for immediate sign-in
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Account verified and created successfully! 🎉",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });

    } catch (err) {
        console.error("register error:", err.message);
        res.status(500).json({
            message: err.message || "Registration failed. Please try again."
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });

    } catch (err) {
        console.error("login error:", err.message);
        res.status(500).json({
            message: err.message || "Login failed"
        });
    }
};
