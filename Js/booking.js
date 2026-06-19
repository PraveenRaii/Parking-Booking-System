const slots =
document.querySelectorAll(".slot");

let selectedSlot = "";

document
.getElementById("continueBtn")
.addEventListener("click",()=>{

window.location.href =
"pyments.html";

});

slots.forEach(slot=>{

    slot.addEventListener("click",()=>{

        slots.forEach(btn=>{
            btn.classList.remove("active");
        });

        slot.classList.add("active");

        selectedSlot =
        slot.innerText;

    });

});

const entryTime =
document.getElementById("entryTime");

const exitTime =
document.getElementById("exitTime");

const totalAmount =
document.getElementById("totalAmount");

function calculatePrice(){

    const entry =
    entryTime.value;

    const exit =
    exitTime.value;

    if(entry && exit){

        const start =
        new Date(`2025-01-01 ${entry}`);

        const end =
        new Date(`2025-01-01 ${exit}`);

        const hours =
        (end-start)/(1000*60*60);

        totalAmount.textContent =
        hours*80;

    }

}

entryTime.addEventListener(
"change",
calculatePrice
);

exitTime.addEventListener(
"change",
calculatePrice
);

document
.getElementById("continueBtn")
.addEventListener("click",()=>{

    if(selectedSlot===""){

        alert("Please Select Slot");

        return;
    }

    window.location.href =
    "pyments.html";

});