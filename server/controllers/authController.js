const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async(req,res)=>{
    try{
       

        const {name,email,password,phone}=req.body;
       

        const exist = await User.findOne({email});

        if(exist){

            return res.status(400).json({
                message:"Email already exists"
            });

        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await User.create({

            name,
            email,
            password:hashPassword,
            phone

        });

        res.status(201).json({

            message:"Registration Successful",
            user

        });

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};

// Login

exports.login = async(req,res)=>{

    try{

        const {email,password}=req.body;

        const user = await User.findOne({email});

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        const match = await bcrypt.compare(password,user.password);

        if(!match){

            return res.status(401).json({
                message:"Invalid Password"
            });

        }

       const token = jwt.sign(

    {

        id:user._id,

        role:user.role

    },

    process.env.JWT_SECRET,

    {

        expiresIn:"7d"

    }

);

        res.json({

            message:"Login Successful",

            token,

            user

        });

    }

    catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};