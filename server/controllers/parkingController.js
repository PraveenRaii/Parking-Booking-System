const Parking = require("../models/Parking");

exports.getAllParking = async (req, res) => {
    try {
        const parkings = await Parking.find();
        res.json(parkings);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

        const parking = await Parking.create(req.body);

        res.status(201).json({
            message: "Parking Added Successfully",
            parking
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.updateParking = async (req, res) => {

    try {

        const parking = await Parking.findByIdAndUpdate(

            req.params.id,

            req.body,

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

        res.status(500).json({
            message: err.message
        });

    }

};

exports.deleteParking = async (req, res) => {

    try {

        await Parking.findByIdAndDelete(req.params.id);

        res.json({

            message: "Parking Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};