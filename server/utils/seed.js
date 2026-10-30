const bcrypt = require("bcrypt");
const Parking = require("../models/Parking");
const User = require("../models/User");

const initialParkings = [
    {
        name: "City Mall Premium Parking",
        city: "Lucknow",
        address: "Gomti Nagar, Near City Mall, Lucknow",
        price: 50,
        totalSlots: 30,
        availableSlots: 18,
        rating: 4.8,
        totalReviews: 12,
        type: "Car",
        image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
        location: {
            type: "Point",
            coordinates: [80.9462, 26.8467]
        }
    },
    {
        name: "Connaught Place Smart Parking",
        city: "Delhi",
        address: "Inner Circle, Connaught Place, New Delhi",
        price: 60,
        totalSlots: 45,
        availableSlots: 22,
        rating: 4.9,
        totalReviews: 38,
        type: "Car",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        location: {
            type: "Point",
            coordinates: [77.2195, 28.6328]
        }
    },
    {
        name: "Cyber City EV & Hybrid Hub",
        city: "Gurgaon",
        address: "DLF Cyber City, Sector 24, Gurugram",
        price: 75,
        totalSlots: 25,
        availableSlots: 14,
        rating: 4.9,
        totalReviews: 24,
        type: "EV",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
        location: {
            type: "Point",
            coordinates: [77.0878, 28.4950]
        }
    },
    {
        name: "Metro Station Multi-Level Parking",
        city: "Noida",
        address: "Sector 18 Metro Station, Noida",
        price: 30,
        totalSlots: 50,
        availableSlots: 31,
        rating: 4.6,
        totalReviews: 19,
        type: "Bike",
        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
        location: {
            type: "Point",
            coordinates: [77.3240, 28.5708]
        }
    },
    {
        name: "Railway Station Plaza Parking",
        city: "Kanpur",
        address: "Station Road, Near Platform 1, Kanpur",
        price: 25,
        totalSlots: 35,
        availableSlots: 15,
        rating: 4.4,
        totalReviews: 9,
        type: "Car",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800",
        location: {
            type: "Point",
            coordinates: [80.3500, 26.4500]
        }
    },
    {
        name: "Airport Express Terminal Parking",
        city: "Delhi",
        address: "Terminal 3, IGI Airport, New Delhi",
        price: 90,
        totalSlots: 60,
        availableSlots: 40,
        rating: 4.9,
        totalReviews: 55,
        type: "Car",
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
        location: {
            type: "Point",
            coordinates: [77.1000, 28.5562]
        }
    }
];

const seedDatabase = async () => {
    try {
        const parkingCount = await Parking.countDocuments();
        if (parkingCount === 0) {
            await Parking.insertMany(initialParkings);
            console.log(`Seeded ${initialParkings.length} default parkings.`);
        }

        const adminExists = await User.findOne({ email: "admin@parkease.com" });
        if (!adminExists) {
            const hashPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                name: "Admin User",
                email: "admin@parkease.com",
                password: hashPassword,
                phone: "9876543210",
                role: "admin"
            });
            console.log("Default admin account created: admin@parkease.com / admin123");
        }

        const userExists = await User.findOne({ email: "user@parkease.com" });
        if (!userExists) {
            const hashPassword = await bcrypt.hash("user123", 10);
            await User.create({
                name: "Rahul Sharma",
                email: "user@parkease.com",
                password: hashPassword,
                phone: "9812345678",
                role: "user"
            });
            console.log("Default user account created: user@parkease.com / user123");
        }
    } catch (e) {
        console.log("Seeding error:", e.message);
    }
};

module.exports = seedDatabase;
