import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ReviewForm from "../components/ReviewForm";
import FavoriteButton from "../components/FavoriteButton";

function ParkingDetails() {

    const { id } = useParams();

const [reviews, setReviews] = useState([]);

    const [parking, setParking] = useState(null);
    const navigate = useNavigate();

    

    const fetchParking = async () => {

        try {

            const res = await API.get(`/parking/${id}`);

            setParking(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };


    const fetchReviews = async () => {

    try {

        const res = await API.get(`/reviews/${id}`);

        setReviews(res.data);

    }

    catch (err) {

        console.log(err);

    }

};

useEffect(() => {

        fetchParking();
       fetchReviews();

    }, []);

    if (!parking) {

        return <h2 className="text-center mt-20">Loading...</h2>;

    }

  return (

    <div className="max-w-6xl mx-auto p-10">

        <img
            src={parking.image}
            className="rounded-xl w-full h-96 object-cover"
        />

<div className="flex justify-between items-center mt-6">

    <h1 className="text-4xl font-bold">

        {parking.name}

    </h1>

    <FavoriteButton

        parkingId={parking._id}

    />

</div>
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


        <ReviewForm
            parkingId={id}
            onReviewAdded={fetchReviews}
        />

        <div className="mt-10">

            <h2 className="text-3xl font-bold mb-5">

                Customer Reviews

            </h2>

            {

                reviews.length === 0 ?

                    (

                        <p>No Reviews Yet.</p>

                    )

                    :

                    (

                        reviews.map((review) => (

                            <div

                                key={review._id}

                                className="bg-white rounded-xl shadow p-5 mb-5"

                            >

                                <div className="flex justify-between">

                                    <h3 className="font-bold">

                                        {review.user?.name}

                                    </h3>

                                    <span>

                                        ⭐ {review.rating}

                                    </span>

                                </div>

                                <p className="mt-3">

                                    {review.comment}

                                </p>

                                <p className="text-gray-500 text-sm mt-3">

                                    {

                                        new Date(

                                            review.createdAt

                                        ).toLocaleDateString()

                                    }

                                </p>

                            </div>

                        ))

                    )

            }

        </div>

    </div>

);
}

export default ParkingDetails;