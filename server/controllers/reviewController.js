const Review = require("../models/Review");
const Parking = require("../models/Parking");

// Add Review

exports.addReview = async (req, res) => {

    try {

        const { rating, comment } = req.body;

        const parkingId = req.params.parkingId;

        // Check if user already reviewed

        const alreadyReviewed = await Review.findOne({

            user: req.user.id,

            parking: parkingId

        });

        if (alreadyReviewed) {

            return res.status(400).json({

                message: "You have already reviewed this parking."

            });

        }

        // Create Review

        await Review.create({

            user: req.user.id,

            parking: parkingId,

            rating,

            comment

        });

        // Calculate New Average Rating

        const reviews = await Review.find({

            parking: parkingId

        });

        const totalRating = reviews.reduce(

            (sum, review) => sum + review.rating,

            0

        );

        const averageRating =

            totalRating / reviews.length;

        // Update Parking

        await Parking.findByIdAndUpdate(

            parkingId,

            {

                rating: averageRating.toFixed(1),

                totalReviews: reviews.length

            }

        );

        res.json({

            success: true,

            message: "Review Added Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

// Get Reviews

exports.getReviews = async (req, res) => {

    try {

        const reviews = await Review.find({

            parking: req.params.parkingId

        })

            .populate("user", "name profileImage")

            .sort({

                createdAt: -1

            });

        res.json(reviews);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};