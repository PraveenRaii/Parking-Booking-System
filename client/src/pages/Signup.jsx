import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
    FaUser,
    FaLock,
    FaEnvelope,
    FaPhone,
    FaCar,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaRegCircle,
    FaShieldAlt,
    FaArrowLeft,
    FaRedo
} from "react-icons/fa";

function Signup() {
    const navigate = useNavigate();

    // Step 1: Form details, Step 2: OTP verification
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: ""
    });

    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Real-time password strength validation
    const passwordChecks = useMemo(() => {
        const pwd = formData.password || "";
        return {
            minLength: pwd.length >= 8,
            hasUpper: /[A-Z]/.test(pwd),
            hasLower: /[a-z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
        };
    }, [formData.password]);

    const strengthScore = useMemo(() => {
        const checks = [
            passwordChecks.minLength,
            passwordChecks.hasUpper,
            passwordChecks.hasLower,
            passwordChecks.hasNumber,
            passwordChecks.hasSpecial
        ];
        return checks.filter(Boolean).length;
    }, [passwordChecks]);

    const isStrongPassword = strengthScore === 5;

    const strengthLabel = useMemo(() => {
        if (!formData.password) return { text: "Enter Password", color: "text-slate-400", bar: "w-0 bg-slate-300" };
        if (strengthScore <= 2) return { text: "Weak Password", color: "text-rose-500", bar: "w-1/4 bg-rose-500" };
        if (strengthScore === 3) return { text: "Fair Password", color: "text-amber-500", bar: "w-2/4 bg-amber-500" };
        if (strengthScore === 4) return { text: "Good Password", color: "text-blue-500", bar: "w-3/4 bg-blue-500" };
        return { text: "Strong Password 💪", color: "text-emerald-500", bar: "w-full bg-emerald-500" };
    }, [formData.password, strengthScore]);

    // Step 1: Send OTP to user's email
    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isStrongPassword) {
            alert("Please ensure your password satisfies all strong password requirements.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match. Please re-enter identical passwords.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/send-otp", {
                email: formData.email.trim(),
                password: formData.password
            });

            alert(res.data.message || `Verification code sent to ${formData.email}! Check your inbox.`);
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        try {
            setLoading(true);
            const res = await API.post("/auth/send-otp", {
                email: formData.email.trim(),
                password: formData.password
            });
            alert(res.data.message || `New verification code sent to ${formData.email}!`);
            setResendCooldown(60);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to resend code.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and Register
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();

        if (!otp.trim() || otp.trim().length !== 6) {
            alert("Please enter the complete 6-digit verification code sent to your email.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/register", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.phone.trim(),
                otp: otp.trim()
            });

            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            alert(res.data.message || "Account verified and registered successfully! 🎉");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Registration verification failed. Please check the code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-70px)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-700 p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-md shadow-orange-500/30 mb-3">
                            {step === 1 ? <FaCar /> : <FaEnvelope />}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                            {step === 1 ? "Create Account" : "Verify Your Email"}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            {step === 1
                                ? "Sign up with a strong password and email verification"
                                : `Enter the 6-digit code sent to ${formData.email}`}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? "w-12 bg-orange-500" : "w-6 bg-emerald-500"}`} />
                        <span className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? "w-12 bg-orange-500" : "w-6 bg-slate-200 dark:bg-slate-700"}`} />
                    </div>

                    {/* STEP 1: Registration Form */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Full Name
                                </label>
                                <div className="relative flex items-center">
                                    <FaUser className="absolute left-4 text-orange-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Email Address (For Verification Code)
                                </label>
                                <div className="relative flex items-center">
                                    <FaEnvelope className="absolute left-4 text-orange-500 pointer-events-none" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="your-email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Phone Number
                                </label>
                                <div className="relative flex items-center">
                                    <FaPhone className="absolute left-4 text-orange-500 pointer-events-none" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="e.g. +91 9876543210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                    />
                                </div>
                            </div>

                            {/* Password Field with Show/Hide Toggle */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">
                                        Password
                                    </label>
                                    <span className={`text-xs font-extrabold ${strengthLabel.color}`}>
                                        {strengthLabel.text}
                                    </span>
                                </div>
                                <div className="relative flex items-center">
                                    <FaLock className="absolute left-4 text-orange-500 pointer-events-none" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 p-1 text-slate-400 hover:text-orange-500 focus:outline-none transition cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>

                                {/* Strength Progress Bar */}
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${strengthLabel.bar}`} />
                                </div>

                                {/* Real-time Criteria Checklist */}
                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                                    <div className="flex items-center gap-1.5 font-semibold text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                                        <FaShieldAlt className="text-orange-500" /> Password Requirements:
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordChecks.minLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`}>
                                        {passwordChecks.minLength ? <FaCheckCircle /> : <FaRegCircle />}
                                        <span>At least 8 characters long</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordChecks.hasUpper && passwordChecks.hasLower ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`}>
                                        {passwordChecks.hasUpper && passwordChecks.hasLower ? <FaCheckCircle /> : <FaRegCircle />}
                                        <span>Uppercase & lowercase letters (A-Z, a-z)</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordChecks.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`}>
                                        {passwordChecks.hasNumber ? <FaCheckCircle /> : <FaRegCircle />}
                                        <span>At least one number (0-9)</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordChecks.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}`}>
                                        {passwordChecks.hasSpecial ? <FaCheckCircle /> : <FaRegCircle />}
                                        <span>At least one special character (!@#$%^&*)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password Field with Show/Hide Toggle */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative flex items-center">
                                    <FaLock className="absolute left-4 text-orange-500 pointer-events-none" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Re-enter strong password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3.5 p-1 text-slate-400 hover:text-orange-500 focus:outline-none transition cursor-pointer"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                                {formData.confirmPassword && (
                                    <p className={`text-xs mt-1 font-semibold ${formData.password === formData.confirmPassword ? "text-emerald-600" : "text-rose-500"}`}>
                                        {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !isStrongPassword || formData.password !== formData.confirmPassword}
                                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-base cursor-pointer"
                            >
                                {loading ? "Sending Verification Code..." : "Send Verification Code 📩"}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Email OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                            <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-900 text-center">
                                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                                    We sent a 6-digit verification code to:
                                </span>
                                <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm block">
                                    {formData.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-2 text-xs font-semibold text-slate-500 hover:text-orange-600 underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <FaArrowLeft size={10} /> Edit Email or Password
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">
                                    Enter 6-Digit OTP Code
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    required
                                    autoFocus
                                    className="w-full py-4 text-center text-3xl font-mono font-black tracking-[0.5em] bg-slate-50 dark:bg-slate-900 border-2 border-orange-200 dark:border-slate-700 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-slate-800 dark:text-white transition"
                                />
                                <span className="text-xs text-slate-400 text-center block mt-2">
                                    Code expires in 10 minutes
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-base cursor-pointer"
                            >
                                {loading ? "Verifying Code..." : "Verify & Complete Registration 🚀"}
                            </button>

                            <div className="text-center pt-2">
                                {resendCooldown > 0 ? (
                                    <span className="text-xs text-slate-400">
                                        Resend code in <strong className="text-orange-600">{resendCooldown}s</strong>
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 inline-flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        <FaRedo size={10} /> Resend Verification Code
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Signup;