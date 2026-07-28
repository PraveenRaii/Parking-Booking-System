const User = require("../models/User");

exports.getUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.json(users);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.deleteUser = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User Deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        res.json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message:"User not found"
            });

        }

        user.name=req.body.name;
        user.phone=req.body.phone;

        if(req.body.image){

            user.image=req.body.image;

        }

        await user.save();

        res.json({

            message:"Profile Updated",

            user

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

};