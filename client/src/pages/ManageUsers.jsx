import { useEffect, useState } from "react";
import API from "../services/api";

function ManageUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        const res = await API.get("/users");

        setUsers(res.data);

    };

    const deleteUser = async (id) => {

        if (!window.confirm("Delete User?")) return;

        await API.delete(`/users/${id}`);

        fetchUsers();

    };

    return (

        <div className="max-w-6xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-8">

                Manage Users

            </h1>

            <table className="w-full bg-white rounded shadow">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        users.map(user => (

                            <tr
                                key={user._id}
                                className="text-center border-b"
                            >

                                <td>{user.name}</td>

                                <td>{user.email}</td>

                                <td>{user.phone}</td>

                                <td>

                                    <button

                                        onClick={() => deleteUser(user._id)}

                                        className="bg-red-600 text-white px-4 py-2 rounded"

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ManageUsers;