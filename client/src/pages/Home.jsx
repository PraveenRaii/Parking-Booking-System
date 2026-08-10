import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ParkingMap from "../components/ParkingMap";
import FavoriteButton from "../components/FavoriteButton";
import socket from "../socket";
function Home() {

    const navigate = useNavigate();

    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [city, setCity] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [priceRange, setPriceRange] = useState(1000);
    const [rating, setRating] = useState(0);

    const [userLocation, setUserLocation] = useState(null);
    

    const categories = [
        "All",
        "Car",
        "Bike",
        "EV",
        "Bicycle"
    ];

    useEffect(() => {

        fetchParkings();

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation({

                    lat: position.coords.latitude,
                    lng: position.coords.longitude

                });

            },

            (err) => console.log(err)

        );
  socket.on("slotUpdated", (data) => {

        setParkings((prev) =>
            prev.map((parking) =>
                parking._id === data.parkingId
                    ? {
                          ...parking,
                          availableSlots: data.availableSlots,
                      }
                    : parking
            )
        );

    });

    return () => {

        socket.off("slotUpdated");

    };



    }, []);

    const fetchParkings = async () => {

        try {

            const res = await API.get("/parking");

            setParkings(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const cities = [

        "All",

        ...new Set(

            parkings.map((parking) => parking.city)

        )

    ];

    const filteredParkings = parkings.filter((parking) => {

        const searchMatch =

            parking.name
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            parking.city
                .toLowerCase()
                .includes(search.toLowerCase());

        const cityMatch =

            city === "All"

            ||

            parking.city === city;

        const categoryMatch =

            category === "All"

            ||

            parking.type === category;

        const priceMatch =

            parking.price <= priceRange;

        const ratingMatch =

            parking.rating >= rating;

        return (

            searchMatch &&
            cityMatch &&
            categoryMatch &&
            priceMatch &&
            ratingMatch

        );

    });
    

    const calculateDistance = (

        lat1,
        lon1,
        lat2,
        lon2

    ) => {

        const R = 6371;

        const dLat =

            (lat2 - lat1) *

            Math.PI /

            180;

        const dLon =

            (lon2 - lon1) *

            Math.PI /

            180;

        const a =

            Math.sin(dLat / 2) *

            Math.sin(dLat / 2)

            +

            Math.cos(lat1 * Math.PI / 180)

            *

            Math.cos(lat2 * Math.PI / 180)

            *

            Math.sin(dLon / 2)

            *

            Math.sin(dLon / 2);

        const c =

            2 *

            Math.atan2(

                Math.sqrt(a),

                Math.sqrt(1 - a)

            );

        return R * c;

    };

    const sortedParkings = [...filteredParkings];

if (sortBy === "low") {

    sortedParkings.sort(
        (a, b) => a.price - b.price
    );

}

if (sortBy === "high") {

    sortedParkings.sort(
        (a, b) => b.price - a.price
    );

}

if (userLocation) {

    sortedParkings.sort((a, b) => {

        if (
            !a.location ||
            !b.location ||
            !Array.isArray(a.location.coordinates) ||
            !Array.isArray(b.location.coordinates) ||
            a.location.coordinates.length < 2 ||
            b.location.coordinates.length < 2
        ) {
            return 0;
        }

        const d1 = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(a.location.coordinates[1]),
            Number(a.location.coordinates[0])
        );

        const d2 = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(b.location.coordinates[1]),
            Number(b.location.coordinates[0])
        );

        return d1 - d2;

    });

}

    return (

        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">

    {/* Hero Section */}

    <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16">

        <div className="max-w-7xl mx-auto px-6">

            <h1 className="text-5xl font-bold">

                Find Your Perfect Parking Space

            </h1>

            <p className="mt-4 text-lg">

                Search • Compare • Book • Park Easily

            </p>

        </div>

    </div>

    {/* Search + Filters */}

    <div className="max-w-7xl mx-auto px-6 mt-8">

        <div className="grid md:grid-cols-5 gap-4">

            {/* Search */}

            <input

                type="text"

                placeholder="Search Parking or City..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                className="border rounded-lg p-3 dark:bg-gray-800"

            />

            {/* City */}

            <select

                value={city}

                onChange={(e) => setCity(e.target.value)}

                className="border rounded-lg p-3 dark:bg-gray-800"

            >

                {

                    cities.map((c) => (

                        <option key={c} value={c}>

                            {c}

                        </option>

                    ))

                }

            </select>

            {/* Sort */}

            <select

                value={sortBy}

                onChange={(e) => setSortBy(e.target.value)}

                className="border rounded-lg p-3 dark:bg-gray-800"

            >

                <option value="">

                    Sort By

                </option>

                <option value="low">

                    Price Low → High

                </option>

                <option value="high">

                    Price High → Low

                </option>

            </select>

            {/* Rating */}

            <select

                value={rating}

                onChange={(e) =>

                    setRating(Number(e.target.value))

                }

                className="border rounded-lg p-3 dark:bg-gray-800"

            >

                <option value="0">

                    All Ratings

                </option>

                <option value="4">

                    4★ & Above

                </option>

                <option value="4.5">

                    4.5★ & Above

                </option>

            </select>

            {/* Price */}

            <div>

                <p className="text-sm mb-1">

                    Max ₹{priceRange}

                </p>

                <input

                    type="range"

                    min="0"

                    max="1000"

                    value={priceRange}

                    onChange={(e) =>

                        setPriceRange(Number(e.target.value))

                    }

                    className="w-full"

                />

            </div>

        </div>

    </div>

    {/* Categories */}

    <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-wrap gap-3">

        {

            categories.map((item) => (

                <button

                    key={item}

                    onClick={() => setCategory(item)}

                    className={`px-5 py-2 rounded-full transition

                    ${

                        category === item

                            ?

                            "bg-blue-600 text-white"

                            :

                            "bg-white dark:bg-gray-800 shadow"

                    }`}

                >

                    {item}

                </button>

            ))

        }

    </div>

    {/* Parking Cards */}

    <div className="max-w-7xl mx-auto px-6 py-10">

        {

            loading

                ?

                (

                    <h2 className="text-center text-2xl">

                        Loading...

                    </h2>

                )

                :

                sortedParkings.length === 0

                    ?

                    (

                        <h2 className="text-center text-2xl">

                            No Parking Found

                        </h2>

                    )

                    :

                    (

                        <div className="grid md:grid-cols-3 gap-8">

                      
                                                    {

                                sortedParkings.map((parking, index) => (
                                    <div

                                        key={parking._id}

                                       className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition duration-300"

                                    >
                                        
                                       <div className="relative">

    <img
        src={parking.image}
        alt={parking.name}
        className="w-full h-56 object-cover"
    />

    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
        <FavoriteButton parkingId={parking._id} />
    </div>

</div>

                                        <div className="p-5">

                                            <div className="flex justify-between items-center">

                                                <h2 className="text-2xl font-bold dark:text-white">

                                                    {parking.name}

                                                </h2>

                                                {

                                                    index === 0 && userLocation && (

                                                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">

                                                            Nearest

                                                        </span>

                                                    )

                                                }

                                            </div>

                                            <p className="text-gray-500 dark:text-gray-300 mt-2">

                                                📍 {parking.city}

                                            </p>

                                            <p className="mt-2 text-yellow-500 font-semibold">

                                                ⭐ {parking.rating}

                                            </p>

                                            <p className="mt-2 text-blue-600 font-bold">

                                                ₹{parking.price}/Hour

                                            </p>

                                            <p className="mt-2">

                                                Available :

                                                <span className="font-bold">

                                                    {" "}

                                                    {parking.availableSlots}

                                                </span>

                                                /

                                                {parking.totalSlots}

                                            </p>
{
    userLocation &&
    parking.location &&
    Array.isArray(parking.location.coordinates) &&
    parking.location.coordinates.length >= 2 && (

        <p className="mt-2 text-green-600 font-semibold">
          Distance:{" "}
            {calculateDistance(
                userLocation.lat,
                userLocation.lng,
                Number(parking.location.coordinates[1]),
                Number(parking.location.coordinates[0])
            ).toFixed(1)}
            km
        </p>

    )
}
                                            {

                                                parking.availableSlots === 0 ? (

                                                    <div className="mt-4 bg-red-600 text-white text-center py-2 rounded-lg">

                                                        Full

                                                    </div>

                                                ) : (

                                                    <button

                                                        onClick={() =>

                                                            navigate(`/parking/${parking._id}`)

                                                        }

                                                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

                                                    >

                                                        View Details

                                                    </button>

                                                )

                                            }

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

        }

    </div>

    {/* Google Map */}

    <div className="max-w-7xl mx-auto px-6 pb-12">

        <h2 className="text-3xl font-bold mb-5 dark:text-white">

            Nearby Parking Map

        </h2>

        <ParkingMap parkings={sortedParkings} />

    </div>

</div>

</>

);

}

export default Home;