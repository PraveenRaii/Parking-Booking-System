const slots = document.querySelectorAll(".slot");

let selectedSlot = "";

// Slot Selection
slots.forEach(slot => {

    slot.addEventListener("click", () => {

        slots.forEach(btn => {
            btn.classList.remove("active");
        });

        slot.classList.add("active");

        selectedSlot = slot.innerText;

    });

});

const entryTime = document.getElementById("entryTime");
const exitTime = document.getElementById("exitTime");
const totalAmount = document.getElementById("totalAmount");

// Price Calculation
function calculatePrice() {

    const entry = entryTime.value;
    const exit = exitTime.value;

    if (!entry || !exit) return;

    const start = new Date(`2025-01-01T${entry}`);
    const end = new Date(`2025-01-01T${exit}`);


     // Next day case
    if (end <= start) {
        end.setDate(end.getDate() + 1);
    }

    
    const hours = (end - start) / (1000 * 60 * 60);

    if (hours <= 0) {
        totalAmount.textContent = "0";
        return;
    }

    totalAmount.textContent = hours * 80;
}

entryTime.addEventListener("change", calculatePrice);
exitTime.addEventListener("change", calculatePrice);

// Continue Button
document
.getElementById("continueBtn")
.addEventListener("click", () => {

    if (selectedSlot === "") {
        alert("Please Select Slot");
        return;
    }

    const bookingData = {

        date: document.getElementById("date").value,
        entryTime: entryTime.value,
        exitTime: exitTime.value,
        vehicle: document.getElementById("vehicle").value,
        slot: selectedSlot,
        total: totalAmount.textContent

    };

    localStorage.setItem(
        "bookingData",
        JSON.stringify(bookingData)
    );

    let history =
JSON.parse(localStorage.getItem("bookingHistory")) || [];

history.push(bookingData);

localStorage.setItem(
"bookingHistory",
JSON.stringify(history)
);

    window.location.href = "pyments.html";

});