import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ParkingDetails() {

    const { id } = useParams();

    const [parking, setParking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        fetchParking();

    }, []);

    const fetchParking = async () => {

        try {

            const res = await API.get(`/parking/${id}`);

            setParking(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    if (!parking) {

        return <h2 className="text-center mt-20">Loading...</h2>;

    }

    return (

        <div className="max-w-6xl mx-auto p-10">

            <img

                src={parking.image}

                className="rounded-xl w-full h-96 object-cover"

            />

            <h1 className="text-4xl font-bold mt-6">

                {parking.name}

            </h1>

            <p className="mt-4 text-gray-500">

                {parking.address}

            </p>

            <h2 className="text-blue-600 text-2xl mt-5">

                ₹ {parking.price} / Hour

            </h2>
                <button
    onClick={() =>
        navigate("/booking", {
            state: { parking }
        })
    }
    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg"
>
    Book Now
</button>
        </div>

    );

}

export default ParkingDetails;