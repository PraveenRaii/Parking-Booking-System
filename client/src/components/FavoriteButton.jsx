import { useEffect, useState } from "react";
import API from "../services/api";

function FavoriteButton({ parkingId }) {

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {

        checkFavorite();

    }, []);

    const checkFavorite = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await API.get("/favorites", {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const exists = res.data.find(

                (item) => item.parking._id === parkingId

            );

            setFavorite(!!exists);

        }

        catch (err) {

            console.log(err);

        }

    };

    const toggleFavorite = async () => {

        try {

            const token = localStorage.getItem("token");

            if (favorite) {

                await API.delete(`/favorites/${parkingId}`, {

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                });

                setFavorite(false);

            }

            else {

                await API.post(

                    "/favorites",

                    {

                        parkingId

                    },

                    {

                        headers: {
                            Authorization: `Bearer ${token}`
                        }

                    }

                );

                setFavorite(true);

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <button

            onClick={toggleFavorite}

            className="text-3xl"

        >

            {favorite ? "❤️" : "🤍"}

        </button>

    );

}

export default FavoriteButton;