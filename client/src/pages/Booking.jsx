import { useLocation } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Booking() {

    const { state } = useLocation();

    const parking = state?.parking;
    if (!parking) {
    return (
        <div className="text-center mt-20">
            <h1 className="text-3xl font-bold">
                Parking not found
            </h1>
        </div>
    );
}

    const [booking, setBooking] = useState({
        vehicleType: "",
        vehicleNumber: "",
        entryDate: "",
        entryTime: "",
        exitDate: "",
        exitTime: ""
    });
    const [totalHours, setTotalHours] = useState(0);
const [totalAmount, setTotalAmount] = useState(0);
const calculatePrice = () => {

    if (
        !booking.entryDate ||
        !booking.entryTime ||
        !booking.exitDate ||
        !booking.exitTime
    ) {
        alert("Please select entry and exit date/time");
        return;
    }

    const entry = new Date(
        `${booking.entryDate}T${booking.entryTime}`
    );

    const exit = new Date(
        `${booking.exitDate}T${booking.exitTime}`
    );

    if (exit <= entry) {
        alert("Exit time should be greater than Entry time");
        return;
    }

    const diff = exit - entry;

    const hours = Math.ceil(diff / (1000 * 60 * 60));

    setTotalHours(hours);

    setTotalAmount(hours * (parking?.price || 0));
};
    const handleChange = (e) => {

        setBooking({
            ...booking,
            [e.target.name]: e.target.value
        });

    };
    const navigate = useNavigate();
    const handleBooking = async () => {

    try {

        const data = {

            parking: parking._id,

            vehicleNumber: booking.vehicleNumber,

            vehicleType: booking.vehicleType,

            entryDate: booking.entryDate,

            entryTime: booking.entryTime,

            exitDate: booking.exitDate,

            exitTime: booking.exitTime,

            totalHours,

            totalAmount

        };

        const res = await API.post("/booking", data);

        alert(res.data.message);

        navigate("/payment", {
            state: {
                booking: res.data.booking
            }
        });

    }

    catch (err) {

        console.log(err);

        alert("Booking Failed");

    }

};

    return (

       <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-black dark:text-white">

            <h1 className="text-3xl font-bold mb-6">

                Booking Details

            </h1>

            <h2 className="text-xl font-semibold text-blue-600">

                {parking?.name}

            </h2>

            <div className="grid grid-cols-2 gap-5 mt-8">

                <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="Vehicle Number"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <select
                    name="vehicleType"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                >

                    <option>Select Vehicle</option>
                    <option>Car</option>
                    <option>Bike</option>
                    <option>EV</option>

                </select>

                <input
                    type="date"
                    name="entryDate"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="time"
                    name="entryTime"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="date"
                    name="exitDate"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

                <input
                    type="time"
                    name="exitTime"
                    onChange={handleChange}
                    className="border p-3 rounded-lg"
                />

            </div>

            <button  onClick={calculatePrice}
                className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
                Calculate Price
            </button>
            {
    totalAmount > 0 && (

        <div className="mt-8 bg-gray-100 p-5 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">

                Booking Summary

            </h2>

            <p>

                Parking :
                <span className="font-semibold">
                    {" "}
                    {parking?.name}
                </span>

            </p>

            <p>

                Total Hours :
                <span className="font-semibold">
                    {" "}
                    {totalHours}
                </span>

            </p>

            <p>

                Price / Hour :
                <span className="font-semibold">

                    ₹{parking?.price}

                </span>

            </p>

            <h3 className="text-2xl text-blue-600 font-bold mt-4">

                Total ₹{totalAmount}

            </h3>
            <button
    onClick={handleBooking}
    disabled={totalAmount === 0}
    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
>
    Proceed To Payment
</button>
        </div>
        

    )
}
        </div>

    );

    

}

export default Booking;