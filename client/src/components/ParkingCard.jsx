import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function ParkingCard({ parking }) {
    const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">

      <img
        src={parking.image}
        alt={parking.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-5">

        <h2 className="text-xl font-bold">{parking.name}</h2>

        <p className="flex items-center gap-2 text-gray-500 mt-2">
          <FaMapMarkerAlt />
          {parking.address}, {parking.city}
        </p>

        <div className="flex justify-between mt-4">

          <span className="text-yellow-500 flex items-center gap-1">
            <FaStar />
            {parking.rating}
          </span>

          <span className="text-green-600 font-semibold">
            {parking.availableSlots} Slots
          </span>

        </div>

        <div className="flex justify-between items-center mt-5">

          <h3 className="text-blue-600 font-bold text-lg">
            ₹{parking.price}/hr
          </h3>

          <button
           onClick={() => navigate(`/parking/${parking._id}`)}

className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ParkingCard;