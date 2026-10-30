import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCamera } from "react-icons/fa";

function Profile() {
    const navigate = useNavigate();

    let currentUser = {};
    try {
        const stored = localStorage.getItem("user");
        if (stored) currentUser = JSON.parse(stored);
    } catch {
        currentUser = {};
    }

    const [user, setUser] = useState(currentUser);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(
        currentUser.image ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.name || "User") + "&background=f97316&color=fff"
    );

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setUser((prev) => ({
                ...prev,
                image: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const userId = user._id || user.id;
            if (userId) {
                await API.put(`/users/${userId}`, {
                    name: user.name,
                    phone: user.phone,
                    image: user.image
                });
            }

            localStorage.setItem("user", JSON.stringify(user));
            alert("Profile Updated Successfully! ✅");
        } catch (err) {
            console.log("handleSave error:", err);
            // Even if server request had an issue, save local
            localStorage.setItem("user", JSON.stringify(user));
            alert("Profile saved locally! ✅");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-orange-100 dark:border-slate-700 p-8">
                    <div className="text-center mb-8">
                        <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Account Settings</span>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            My Profile
                        </h1>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Profile Avatar"
                                className="w-32 h-32 rounded-full object-cover ring-4 ring-orange-500 shadow-md"
                            />
                            <label className="absolute bottom-1 right-1 p-2.5 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-full shadow-md cursor-pointer hover:scale-105 transition">
                                <FaCamera size={14} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImage}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">Click the camera icon to upload photo</p>
                    </div>

                    <form onSubmit={handleSave} className="mt-8 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                                <FaUser className="text-orange-500" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={user.name || ""}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                required
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                                <FaEnvelope className="text-orange-500" /> Email Address (Read-only)
                            </label>
                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-500 p-3 rounded-xl text-sm outline-none cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                                <FaPhone className="text-orange-500" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                value={user.phone || ""}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                placeholder="+91 9876543210"
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                                <FaShieldAlt className="text-orange-500" /> Account Role
                            </label>
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                user.role === "admin"
                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                            }`}>
                                {user.role === "admin" ? "👑 Administrator" : "Verified User"}
                            </span>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition text-sm"
                            >
                                {saving ? "Saving Changes..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold py-3 rounded-xl transition text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
