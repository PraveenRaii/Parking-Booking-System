import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaLock, FaEnvelope, FaCar, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // If user came from booking flow, take them right back to complete booking
            if (location.state?.returnUrl) {
                navigate(location.state.returnUrl, {
                    state: { parking: location.state.parking }
                });
                return;
            }

            if (res.data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-70px)] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-700 p-8">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-md shadow-orange-500/30 mb-3">
                            <FaCar />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Sign in to your ParkEase account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Email Address
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
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-4 text-orange-500 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-800 dark:text-white transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 p-1 text-slate-400 hover:text-orange-500 focus:outline-none transition"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-base cursor-pointer"
                        >
                            {loading ? "Signing in..." : "Login to Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;