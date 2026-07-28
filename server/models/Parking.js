const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    price:{
        type:Number,
        required:true
    },

    totalSlots:{
        type:Number,
        required:true
    },

    availableSlots:{
        type:Number,
        required:true
    },

    rating:{
        type:Number,
        default:4.5
    },
    location: {

    type: {

        type: String,

        enum: ["Point"],

        default: "Point"

    },
    type: {
    type: String,
    enum: ["Car", "Bike", "EV", "Bicycle"],
    default: "Car"
},

    coordinates: {

        type: [Number],

        required: true

    }

},

   
},{
    timestamps:true
});

module.exports = mongoose.model("Parking",parkingSchema);