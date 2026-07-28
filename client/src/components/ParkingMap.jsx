import {  useEffect } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
     DirectionsRenderer,
    useJsApiLoader
} from "@react-google-maps/api";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const containerStyle = {
    width: "100%",
    height: "500px"
};



function ParkingMap({ parkings }) {

    const navigate = useNavigate();

    const [selected, setSelected] = useState(null);
const [userLocation, setUserLocation] = useState(null);
const [directions, setDirections] = useState(null);
const showRoute = () => {

    if (!userLocation || !selected) return;

    const directionsService =
        new window.google.maps.DirectionsService();

    directionsService.route(
        {
            origin: userLocation,
            destination: {
                lat: selected.location.coordinates[1],
                lng: selected.location.coordinates[0]
            },
            travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
            if (status === "OK") {
                setDirections(result);
            }
        }
        
    );
    const leg = result.routes[0].legs[0];

alert(
    `Distance: ${leg.distance.text}
Time: ${leg.duration.text}`
);
};
    const { isLoaded } = useJsApiLoader({

        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    });
    useEffect(() => {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            setUserLocation({

                lat: position.coords.latitude,

                lng: position.coords.longitude

            });

        },

        (error) => {

            console.log(error);

        }

    );

}, []);
const mapcenter =  userLocation || {
    lat: 28.6139,
    lng: 77.2090
};
const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;

    const dLon = (lon2 - lon1) * Math.PI / 180;

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

        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(1);

};

    if (!isLoaded) return <h2>Loading Map...</h2>;

    return (

        <GoogleMap

            mapContainerStyle={containerStyle}

            center={mapcenter}

            zoom={12}

        >

            {/* User Marker */}

{userLocation && (
    <Marker
        position={userLocation}
        icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }}
    />
)}

{/* Parking Markers */}

{parkings
    .filter(
        (parking) =>
            parking.location &&
            parking.location.coordinates &&
            parking.location.coordinates.length === 2
    )
    .map((parking) => (
        <Marker
            key={parking._id}
            position={{
                lat: parking.location.coordinates[1],
                lng: parking.location.coordinates[0]
            }}
            onClick={() => setSelected(parking)}
        />
    ))}

    {directions && (
    <DirectionsRenderer directions={directions} />
)}

        

            {

                selected && (

                    <InfoWindow

                        position={{

                            lat: selected.location.coordinates[1],

                            lng: selected.location.coordinates[0]

                        }}

                        onCloseClick={() => setSelected(null)}

                    >

                        <div className="w-56">

                            <img

                                src={selected.image}

                                className="rounded mb-2"

                            />

                            <h3 className="font-bold">

                                {selected.name}

                            </h3>

                            <p>

                                ₹{selected.price}/Hour

                            </p>
                            {
userLocation && (

<p className="font-semibold text-blue-600">

Distance :

{

calculateDistance(

userLocation.lat,

userLocation.lng,

selected.location.coordinates[1],

selected.location.coordinates[0]

)

}

 km

</p>

)
}

                            <button

                                onClick={() =>

                                    navigate(`/parking/${selected._id}`)

                                }

                                className="bg-blue-600 text-white mt-2 px-4 py-2 rounded"

                            >

                                View

                            </button>
<button

onClick={() => {

window.open(

`https://www.google.com/maps/dir/?api=1&destination=${selected.location.coordinates[1]},${selected.location.coordinates[0]}`,

"_blank"

);

}}

className="bg-green-600 text-white w-full mt-2 py-2 rounded"

>

Get Directions

</button>
<button
    onClick={showRoute}
    className="bg-purple-600 text-white w-full mt-2 py-2 rounded"
>
    Show Route
</button>
                        </div>

                    </InfoWindow>

                )

            }

        </GoogleMap>

    );

}

export default ParkingMap;