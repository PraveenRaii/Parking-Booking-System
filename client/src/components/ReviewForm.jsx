import { useState } from "react";
import API from "../services/api";

function ReviewForm({ parkingId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const submitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to submit a review.");
            return;
        }

        if (!comment.trim()) {
            alert("Please enter your review comment.");
            return;
        }

        try {
            setLoading(true);
            await API.post(`/reviews/${parkingId}`, {
                rating,
                comment
            });

            alert("Review Added Successfully! ⭐");
            setComment("");
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitReview} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-orange-100 dark:border-slate-700 p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <span>⭐</span> Write a Review
            </h2>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Your Rating
                </label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Below Average)</option>
                    <option value="1">⭐ (1 - Poor)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Your Feedback
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    placeholder="Share details about security, cleanliness, or slot availability..."
                    className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition hover:shadow-orange-500/40"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}

export default ReviewForm;
