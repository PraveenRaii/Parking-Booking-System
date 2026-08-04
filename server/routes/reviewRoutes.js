const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    addReview,
    getReviews
} = require("../controllers/reviewController");


router.post("/:parkingId", authMiddleware, addReview);
router.get("/:parkingId", getReviews);

module.exports = router;