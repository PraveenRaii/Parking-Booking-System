const methods =
document.querySelectorAll(".method");

const cardBox =
document.querySelector(".card-box");

const upiBox =
document.querySelector(".upi-box");

const walletBox =
document.querySelector(".wallet-box");

const cashBox =
document.querySelector(".cash-box");

methods.forEach(method=>{

    method.addEventListener("click",()=>{

        methods.forEach(item=>{
            item.classList.remove("active");
        });

        method.classList.add("active");

        const type =
        method.dataset.payment;

        cardBox.style.display="none";
        upiBox.style.display="none";
        walletBox.style.display="none";
        cashBox.style.display="none";

        if(type==="card"){
            cardBox.style.display="block";
        }

        if(type==="upi"){
            upiBox.style.display="block";
        }

        if(type==="wallet"){
            walletBox.style.display="block";
        }

        if(type==="cash"){
            cashBox.style.display="block";
        }

    });

});

cardBox.style.display="block";

let booking =
JSON.parse(localStorage.getItem("bookingData"));

let history =
JSON.parse(localStorage.getItem("bookingHistory")) || [];

history.push(booking);

localStorage.setItem(
    "bookingHistory",
    JSON.stringify(history)
);

document
.getElementById("payBtn")
.addEventListener("click",()=>{

    const activeMethod =
    document.querySelector(".method.active")
    .dataset.payment;

    if(activeMethod==="card"){

        if(
            document.getElementById("cardNumber").value==="" ||
            document.getElementById("cardHolder").value===""
        ){
            alert("Fill Card Details");
            return;
        }

    }

    if(activeMethod==="upi"){

        if(
            document.getElementById("upiId").value===""
        ){
            alert("Enter UPI ID");
            return;
        }

    }

    alert("Payment Successful");

    window.location.href =
    "succes.html";

});

const bookingData =
JSON.parse(localStorage.getItem("bookingData"));

if(bookingData){

    let fee =
    Number(bookingData.total);

    let gst =
    Math.round(fee * 0.18);

    let final =
    fee + gst;

    document.getElementById("parkingFee")
    .textContent = fee;

    document.getElementById("gstAmount")
    .textContent = gst;

    document.getElementById("finalAmount")
    .textContent = final;
}

let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];

notifications.push({

    title:"Payment Successful",

    message:"Your parking slot has been booked successfully.",

    time:new Date().toLocaleString()

});

localStorage.setItem(
"notifications",
JSON.stringify(notifications)
);