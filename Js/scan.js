const result =
document.getElementById("result");

const scanner =
new Html5Qrcode("reader");

scanner.start(

    {
        facingMode:"environment"
    },

    {
        fps:10,
        qrbox:250
    },

    (decodedText)=>{

        result.innerHTML =
        "✅ QR Detected <br><br>" +
        decodedText;

        scanner.stop();

        setTimeout(()=>{

            window.location.href="ticket.html";

        },2000);

    },

    ()=>{}

);

document
.getElementById("backBtn")
.addEventListener("click",()=>{

    history.back();

});