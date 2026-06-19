// Find Parking Button Redirect

const findBtn = document.getElementById("findParking");

if(findBtn){

    findBtn.addEventListener("click",()=>{

        window.location.href = "map.html";

    });

}


// Category Button Active Change

const categories =
document.querySelectorAll(".categories button");


categories.forEach(button=>{

    button.addEventListener("click",()=>{

        categories.forEach(btn=>{

            btn.classList.remove("active-category");

        });


        button.classList.add("active-category");

    });

});


// Parking Card Click Open Details

const cards =
document.querySelectorAll(".parking-card");


cards.forEach(card=>{


    card.addEventListener("click",()=>{


        window.location.href =
        "details.html";


    });


});


// Search Parking

const searchInput =
document.querySelector(".search-box input");


if(searchInput){


searchInput.addEventListener("keyup",()=>{


    let value =
    searchInput.value.toLowerCase();


    cards.forEach(card=>{


        let text =
        card.innerText.toLowerCase();


        if(text.includes(value)){

            card.style.display="block";

        }
        else{

            card.style.display="none";

        }


    });


});

}