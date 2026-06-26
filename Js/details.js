const parking =
JSON.parse(
localStorage.getItem("selectedParking")
);

if(parking){

    document.getElementById(
        "parkingName"
    ).innerText = parking.name;

    document.getElementById(
        "parkingRating"
    ).innerText = parking.rating;

    document.getElementById(
        "parkingAddress"
    ).innerText = parking.address;

    document.getElementById(
        "parkingPrice"
    ).innerText = parking.price;

    document.getElementById(
        "parkingImage"
    ).src = parking.image;

}

const parking =
JSON.parse(localStorage.getItem("selectedParking"));

console.log(parking);