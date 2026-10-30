import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { FaTrash, FaUserShield, FaUser } from "react-icons/fa";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await API.get("/users");
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log("fetchUsers error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/users/${id}`);
            alert("User deleted successfully! 🗑️");
            fetchUsers();
        } catch (err) {
            console.log("deleteUser error:", err);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8">
                    <span className="text-orange-500 font-extrabold text-xs uppercase tracking-wider">Accounts</span>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                        Registered User Accounts
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-orange-600 font-semibold">
                        Loading user accounts...
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-orange-100 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs uppercase font-extrabold tracking-wider">
                                    <tr>
                                        <th className="py-4 px-6">User</th>
                                        <th className="py-4 px-6">Email</th>
                                        <th className="py-4 px-6">Phone</th>
                                        <th className="py-4 px-6">Role</th>
                                        <th className="py-4 px-6 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400">
                                                No users registered yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-orange-50/40 dark:hover:bg-slate-700/40 transition"
                                            >
                                                <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-bold text-sm">
                                                        {(user.name || "U")[0].toUpperCase()}
                                                    </div>
                                                    <span>{user.name}</span>
                                                </td>

                                                <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                                    {user.email}
                                                </td>

                                                <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                                    {user.phone || "—"}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                        user.role === "admin"
                                                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                                                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                                    }`}>
                                                        {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                                                        <span>{user.role === "admin" ? "Admin" : "User"}</span>
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    {user.role !== "admin" ? (
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl transition"
                                                            title="Delete user"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-semibold">Protected</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ManageUsers;
