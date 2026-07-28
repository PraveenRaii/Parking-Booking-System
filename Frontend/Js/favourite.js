// Search Favourite

const searchInput = document.querySelector(".search-box input");
const cards = document.querySelectorAll(".fav-card");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    cards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        if(title.includes(value)){
            card.style.display = "flex";
        }
        else{
            card.style.display = "none";
        }

    });

});


// Remove Favourite

const hearts = document.querySelectorAll(".heart");

hearts.forEach(btn=>{

    btn.addEventListener("click",()=>{

        const card = btn.parentElement;

        card.remove();

        alert("Removed from Favourite");

    });

});


// View Details

const detailBtn = document.querySelectorAll(".fav-content button");

detailBtn.forEach(btn=>{

    btn.addEventListener("click",()=>{

        window.location.href="details.html";

    });

});