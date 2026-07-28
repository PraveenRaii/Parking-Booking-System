const historyList =
document.getElementById("historyList");

let bookings =
JSON.parse(localStorage.getItem("bookingHistory")) || [];

if(bookings.length==0){

historyList.innerHTML=
"<h3 class='empty'>No Booking Found</h3>";

}
else{

bookings.reverse().forEach(item=>{

historyList.innerHTML += `

<div class="card">

<h3>${item.parkingName || "Parking"}</h3>

<p><b>Date :</b> ${item.date}</p>

<p><b>Entry :</b> ${item.entryTime}</p>

<p><b>Exit :</b> ${item.exitTime}</p>

<p><b>Vehicle :</b> ${item.vehicle}</p>

<p><b>Slot :</b> ${item.slot}</p>

<p><b>Amount :</b> ₹${item.total}</p>

</div>

`;

});

}