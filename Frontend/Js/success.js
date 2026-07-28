const bookingData =
JSON.parse(localStorage.getItem("bookingData"));



if(bookingData){

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

}

const bookingId =
"PK" +
Math.floor(
100000 + Math.random()*900000
);

localStorage.setItem(
"bookingId",
bookingId
);

document.getElementById("bookingId")
.textContent =
`Booking ID: ${bookingId}`;