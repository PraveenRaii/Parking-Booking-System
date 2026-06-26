

// Find Parking Button Redirect

const findBtn = document.getElementById("findParking");

if(findBtn){

    findBtn.addEventListener("click",()=>{

        window.location.href = "./Pages/map.html";

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


cards.forEach(card => {

    card.addEventListener("click", () => {

        const parkingData = {

            name: card.dataset.name,
            address: card.dataset.address,
            price: card.dataset.price,
            rating: card.dataset.rating,
            image: card.dataset.image

        };
      
       

        localStorage.setItem(
            "selectedParking",
            JSON.stringify(parkingData)
        );

        window.location.href =
        "Pages/details.html";

    });

});


// Search Parking

const searchInput =
document.querySelector(".search-box input");


if(searchInput){


searchInput.addEventListener("keyup",()=>{

    let value = searchInput.value.toLowerCase();

    console.log("Searching:", value);

    cards.forEach(card=>{

        let text = card.textContent.toLowerCase();

        console.log(text);

        if(text.includes(value)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

});


};

const categoryBtns =
document.querySelectorAll(".categories button");

categoryBtns.forEach(btn=>{

    btn.addEventListener("click",()=>{

        categoryBtns.forEach(b=>
            b.classList.remove("active-category")
        );

        btn.classList.add("active-category");

        const type = btn.dataset.type;

        cards.forEach(card=>{

            if(card.dataset.type === type){
                card.style.display = "block";
            }else{
                card.style.display = "none";
            }

        });

    });

});


//fav icon
const favBtns = document.querySelectorAll(".fav-btn");

favBtns.forEach((btn,index)=>{

    if(localStorage.getItem(`fav-${index}`) === "true"){
        btn.classList.add("active");
    }

    btn.addEventListener("click",(e)=>{

        e.stopPropagation();

        btn.classList.toggle("active");

        localStorage.setItem(
            `fav-${index}`,
            btn.classList.contains("active")
        );

    });

});


const homeBtn = document.querySelector(".home-btn");
const mapBtn = document.querySelector(".map-btn");
const notificationBtn = document.querySelector(".notification-btn");
const profileBtn = document.querySelector(".profile-btn");


if(mapBtn){

    mapBtn.addEventListener("click",()=>{

        window.location.href = "Pages/map.html";

    });

}

if(profileBtn){

    profileBtn.addEventListener("click",()=>{

        window.location.href = "./Pages/profile.html";

    });

}

if(notificationBtn){

    notificationBtn.addEventListener("click",()=>{

        window.location.href = "Pages/notification.html";

    });

}


if(homeBtn){

    homeBtn.addEventListener("click",()=>{

        window.location.href = "../index.html";

    });

}

const scanBtn =
document.querySelector(".scan-btn");

if(scanBtn){

    scanBtn.addEventListener("click",()=>{

        window.location.href =
        "Pages/scan.html";

    });

}