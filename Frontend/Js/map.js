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


function initMap() {
    

    const lucknow = {
        lat: 26.8467,
        lng: 80.9462
    };

    const map = new google.maps.Map(
        document.getElementById("map"),
        {
            zoom: 12,
            center: lucknow
        }
    );

    
    new google.maps.Marker({
        position: {
            lat: 26.8467,
            lng: 80.9462
        },
        map: map,
        title: "Victoria Parking"
    });

    new google.maps.Marker({
        position: {
            lat: 26.8500,
            lng: 81.0080
        },
        map: map,
        title: "City Mall Parking"
    });

    new google.maps.Marker({
        position: {
            lat: 26.8200,
            lng: 80.9000
        },
        map: map,
        title: "Metro Parking"
    });
}