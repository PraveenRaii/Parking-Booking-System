const methods =
document.querySelectorAll(".method");

methods.forEach(method=>{

    method.addEventListener("click",()=>{

        methods.forEach(item=>{
            item.classList.remove("active");
        });

        method.classList.add("active");

    });

});

document
.getElementById("payBtn")
.addEventListener("click",()=>{

    window.location.href =
    "succes.html";

});