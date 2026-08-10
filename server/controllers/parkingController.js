const Parking = require("../models/Parking");

exports.getAllParking = async (req, res) => {
    try {
        const parkings = await Parking.find();

        res.json(parkings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


exports.getParkingById = async (req, res) => {
    try {

        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found"
            });
        }

        res.json(parking);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


exports.addParking = async (req, res) => {
    try {
        const { latitude, longitude, ...data } = req.body;

        const parking = await Parking.create({
            ...data,

            location: {
                type: "Point",
                coordinates: [
                    Number(longitude),
                    Number(latitude)
                ]
            }
        });

        res.status(201).json({
            message: "Parking Added Successfully",
            parking
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
};

exports.updateParking = async (req, res) => {
    try {

        const updateData = {
            ...req.body
        };

        // Agar latitude/longitude update kiye gaye hain
        if (
            req.body.latitude !== undefined &&
            req.body.longitude !== undefined
        ) {

            updateData.location = {
                type: "Point",

                coordinates: [
                    Number(req.body.longitude),
                    Number(req.body.latitude)
                ]
            };

        }

        const parking = await Parking.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!parking) {

            return res.status(404).json({
                message: "Parking not found"
            });

        }

        res.json({
            message: "Parking Updated Successfully",
            parking
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }
};


exports.deleteParking = async (req, res) => {
    try {

        const parking = await Parking.findByIdAndDelete(
            req.params.id
        );

        if (!parking) {

            return res.status(404).json({
                message: "Parking not found"
            });

        }

        res.json({
            message: "Parking Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};