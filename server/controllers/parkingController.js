const Parking = require("../models/Parking");

// Approximate city center coordinates for automatic fallback
const cityCoordinates = {
    delhi: [77.2090, 28.6139],
    noida: [77.3910, 28.5355],
    gurgaon: [77.0266, 28.4595],
    mumbai: [72.8777, 19.0760],
    bangalore: [77.5946, 12.9716],
    lucknow: [80.9462, 26.8467],
    kanpur: [80.3319, 26.4499],
    pune: [73.8567, 18.5204],
    hyderabad: [78.4867, 17.3850],
    kolkata: [88.3639, 22.5726]
};

exports.getAllParking = async (req, res) => {
    try {
        const parkings = await Parking.find().sort({ createdAt: -1 });
        res.json(parkings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getParkingById = async (req, res) => {
    try {
        const parking = await Parking.findById(req.params.id);
        if (!parking) {
            return res.status(404).json({ message: "Parking not found" });
        }
        res.json(parking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addParking = async (req, res) => {
    try {
        const { latitude, longitude, ...data } = req.body;

        let coords = [77.2090, 28.6139]; // Default [lng, lat]
        const cityKey = (data.city || "").toLowerCase().trim();
        if (cityCoordinates[cityKey]) {
            coords = cityCoordinates[cityKey];
        }

        const parsedLat = parseFloat(latitude);
        const parsedLng = parseFloat(longitude);
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            coords = [parsedLng, parsedLat];
        }

        const parking = await Parking.create({
            ...data,
            location: {
                type: "Point",
                coordinates: coords
            }
        });

        res.status(201).json({
            message: "Parking Added Successfully",
            parking
        });
    } catch (err) {
        console.log("addParking error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateParking = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
            const parsedLat = parseFloat(req.body.latitude);
            const parsedLng = parseFloat(req.body.longitude);
            if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                updateData.location = {
                    type: "Point",
                    coordinates: [parsedLng, parsedLat]
                };
            }
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
            return res.status(404).json({ message: "Parking not found" });
        }

        res.json({
            message: "Parking Updated Successfully",
            parking
        });
    } catch (err) {
        console.log("updateParking error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteParking = async (req, res) => {
    try {
        const parking = await Parking.findByIdAndDelete(req.params.id);
        if (!parking) {
            return res.status(404).json({ message: "Parking not found" });
        }
        res.json({ message: "Parking Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
