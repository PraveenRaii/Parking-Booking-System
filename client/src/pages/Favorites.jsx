import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Favorites() {

    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        fetchFavorites();

    }, []);

    const fetchFavorites = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await API.get("/favorites", {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            setFavorites(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <>
            <Navbar />

            <div className="max-w-7xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold mb-8">

                    ❤️ My Favorite Parkings

                </h1>

                {

                    favorites.length === 0 ?

                        <h2>No Favorites Yet</h2>

                        :

                        <div className="grid md:grid-cols-3 gap-8">

                            {

                                favorites.map((item) => (

                                    <div
                                        key={item._id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                                    >

                                        <img
                                            src={item.parking.image}
                                            className="w-full h-56 object-cover"
                                        />

                                        <div className="p-5">

                                            <h2 className="text-2xl font-bold">

                                                {item.parking.name}

                                            </h2>

                                            <p>

                                                📍 {item.parking.city}

                                            </p>

                                            <p className="text-blue-600 font-bold mt-2">

                                                ₹{item.parking.price}/Hour

                                            </p>

                                            <button

                                                onClick={() =>
                                                    navigate(`/parking/${item.parking._id}`)
                                                }

                                                className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg"

                                            >

                                                View Details

                                            </button>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                }

            </div>

        </>

    );

}

export default Favorites;