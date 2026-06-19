const markers = document.querySelectorAll(".marker");

const parkingName =
document.getElementById("parking-name");

const parkingRating =
document.getElementById("parking-rating");

const parkingLocation =
document.getElementById("parking-location");

const parkingPrice =
document.getElementById("parking-price");

document
.querySelector(".book-btn")
.addEventListener("click",()=>{

    window.location.href =
    "details.html";

});

markers.forEach(marker => {

    marker.addEventListener("click", () => {

        markers.forEach(item => {
            item.classList.remove("active");
        });

        marker.classList.add("active");

        parkingName.textContent =
        marker.dataset.name;

        parkingRating.textContent =
        marker.dataset.rating;

        parkingLocation.textContent =
        marker.dataset.location;

        parkingPrice.textContent =
        marker.dataset.price;

    });

});