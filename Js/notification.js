let notifications =
JSON.parse(localStorage.getItem("notifications")) || [];

const list =
document.getElementById("notificationList");

function loadNotifications(){

    list.innerHTML="";

    if(notifications.length===0){

        list.innerHTML=
        "<h3>No Notifications</h3>";

        return;

    }

    notifications.reverse().forEach(item=>{

        list.innerHTML+=`

        <div class="notification-card">

            <h3>${item.title}</h3>

            <p>${item.message}</p>

            <span>${item.time}</span>

        </div>

        `;

    });

}

loadNotifications();

document
.getElementById("clearBtn")
.addEventListener("click",()=>{

    localStorage.removeItem("notifications");

    notifications=[];

    loadNotifications();

});