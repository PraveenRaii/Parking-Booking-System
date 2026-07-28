const bookingData =
JSON.parse(
localStorage.getItem("bookingData")
);

const parkingData =
JSON.parse(
localStorage.getItem("selectedParking")
);

document.getElementById("vehicle")
.textContent =
bookingData.vehicle;

document.getElementById("slot")
.textContent =
bookingData.slot;

document.getElementById("date")
.textContent =
bookingData.date;

document.getElementById("amount")
.textContent =
bookingData.total;

document.getElementById("parkingName")
.textContent =
parkingData.name;

let bookingId =
localStorage.getItem("bookingId");

if(!bookingId){

    bookingId =
    "PK" +
    Math.floor(
        100000 +
        Math.random()*900000
    );

    localStorage.setItem(
        "bookingId",
        bookingId
    );

}

document.getElementById("bookingId")
.textContent =
bookingId;

document
.getElementById("downloadBtn")
.addEventListener("click",()=>{

    window.print();

});