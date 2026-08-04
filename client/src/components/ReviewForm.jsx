import { useState } from "react";
import API from "../services/api";

function ReviewForm({ parkingId, onReviewAdded }) {

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const submitReview = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.post(

                `/reviews/${parkingId}`,

                {
                    rating,
                    comment
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            alert("Review Added Successfully ✅");

            setComment("");
            setRating(5);

            onReviewAdded();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Failed to add review"

            );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">

                Write a Review

            </h2>

            <select

                value={rating}

                onChange={(e)=>setRating(Number(e.target.value))}

                className="border p-3 rounded w-full"

            >

                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="2">⭐⭐</option>
                <option value="1">⭐</option>

            </select>

            <textarea

                value={comment}

                onChange={(e)=>setComment(e.target.value)}

                rows="4"

                placeholder="Write your review..."

                className="border p-3 rounded w-full mt-4"

            />

            <button

                onClick={submitReview}

                className="bg-blue-600 text-white px-6 py-3 rounded mt-4"

            >

                Submit Review

            </button>

        </div>

    );

}

export default ReviewForm;