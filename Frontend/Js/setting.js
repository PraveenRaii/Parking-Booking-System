const notification=document.querySelectorAll(".switch input")[0];

const darkMode=document.querySelectorAll(".switch input")[1];


// Notification

notification.addEventListener("change",()=>{

    if(notification.checked){

        alert("Notifications Enabled");

    }

    else{

        alert("Notifications Disabled");

    }

});


// Dark Mode

darkMode.addEventListener("change",()=>{

    document.body.classList.toggle("dark");

});


// Logout

const logout=document.querySelector(".logout-btn");

logout.addEventListener("click",()=>{

    let check=confirm("Are you sure you want to Logout?");

    if(check){

        alert("Logout Successfully");

        window.location.href="signin.html";

    }

});


// Setting Items

const items=document.querySelectorAll(".setting-item");

items[0].addEventListener("click",()=>{

    alert("Edit Profile");

});

items[3].addEventListener("click",()=>{

    alert("Language Settings");

});

items[4].addEventListener("click",()=>{

    alert("Payment Method");

});

items[5].addEventListener("click",()=>{

    alert("Saved Address");

});

items[6].addEventListener("click",()=>{

    alert("Privacy Policy");

});

items[7].addEventListener("click",()=>{

    alert("Help & Support");

});