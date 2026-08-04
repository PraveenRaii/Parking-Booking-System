const Favorite = require("../models/Favorite");

// Add Favorite
exports.addFavorite = async (req, res) => {

    try {

        const { parkingId } = req.body;

        const exists = await Favorite.findOne({
            user: req.user.id,
            parking: parkingId
        });

        if (exists) {

            return res.status(400).json({
                message: "Already in favorites"
            });

        }

        const favorite = await Favorite.create({

            user: req.user.id,

            parking: parkingId

        });

        res.status(201).json(favorite);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Remove Favorite
exports.removeFavorite = async (req, res) => {

    try {

        await Favorite.findOneAndDelete({

            user: req.user.id,

            parking: req.params.parkingId

        });

        res.json({
            message: "Removed Successfully"
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Get My Favorites
exports.getFavorites = async (req, res) => {

    try {

        const favorites = await Favorite.find({

            user: req.user.id

        }).populate("parking");

        res.json(favorites);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};