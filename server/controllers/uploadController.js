const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {

    try {

        const result = await cloudinary.uploader.upload(

            req.file.path,

            {
                folder: "ParkingBooking"
            }

        );

        res.json({

            image: result.secure_url

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};