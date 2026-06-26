const parking =
JSON.parse(
localStorage.getItem("selectedParking")
);

console.log(parking);

if(parking){

    document.querySelector("h2").innerText =
    parking.name;

    document.querySelectorAll(".info-row")[0].innerHTML =
    `Rating: ${parking.rating}`;

    document.querySelectorAll(".info-row")[1].innerHTML =
    `Address: ${parking.address}`;

    document.querySelectorAll(".info-row")[2].innerHTML =
    `₹ ${parking.price}`;

    if(parking.image){
       document.querySelector(".hero-image img").src =
"../" + parking.image;
    }

}