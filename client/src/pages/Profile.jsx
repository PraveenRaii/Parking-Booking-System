import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    const [user, setUser] = useState(currentUser);

    const [preview, setPreview] = useState(
        currentUser.image ||
        "https://ui-avatars.com/api/?name=" +
        (currentUser.name || "User")
    );

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);

        const updatedUser = {
            ...user,
            image: imageUrl
        };

        setUser(updatedUser);

    };

    const handleSave = () => {

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        alert("Profile Updated Successfully");

    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6">

            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">

                    My Profile

                </h1>

                <div className="flex flex-col items-center">

                    <img
                        src={preview}
                        alt="Profile"
                        className="w-36 h-36 rounded-full object-cover border-4 border-blue-600"
                    />

                    <label className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg cursor-pointer">

                        Choose Photo

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImage}
                        />

                    </label>

                </div>

                <div className="mt-8 space-y-5">

                    <div>

                        <label className="font-semibold dark:text-white">

                            Name

                        </label>

                        <input
                            type="text"
                            value={user.name || ""}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    name: e.target.value
                                })
                            }
                            className="w-full mt-2 border rounded-lg p-3"
                        />

                    </div>

                    <div>

                        <label className="font-semibold dark:text-white">

                            Email

                        </label>

                        <input
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                        />

                    </div>

                    <div>

                        <label className="font-semibold dark:text-white">

                            Phone

                        </label>

                        <input
                            type="text"
                            value={user.phone || ""}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    phone: e.target.value
                                })
                            }
                            className="w-full mt-2 border rounded-lg p-3"
                        />

                    </div>

                    <div>

                        <label className="font-semibold dark:text-white">

                            Role

                        </label>

                        <div className="mt-2">

                            <span
                                className={`px-4 py-2 rounded-full text-white ${
                                    user.role === "admin"
                                        ? "bg-red-600"
                                        : "bg-green-600"
                                }`}
                            >

                                {user.role || "User"}

                            </span>

                        </div>

                    </div>

                </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                >

                    Save Changes

                </button>

                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >

                    Logout

                </button>

            </div>

        </div>

    );

}

export default Profile;