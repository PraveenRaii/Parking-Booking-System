const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    addFavorite,

    removeFavorite,

    getFavorites

} = require("../controllers/favoriteController");

router.post("/", authMiddleware, addFavorite);

router.delete("/:parkingId", authMiddleware, removeFavorite);

router.get("/", authMiddleware, getFavorites);

module.exports = router;