import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
   getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Firebase Config
const firebaseConfig = {
 apiKey: "AIzaSyAaieTzBDDptfYi2VJNcq13_DWXUrztB7A",
  authDomain: "authentication-14b95.firebaseapp.com",
  projectId: "authentication-14b95",
  storageBucket: "authentication-14b95.firebasestorage.app",
  messagingSenderId: "841726501951",
  appId: "1:841726501951:web:d21f34471cbc134e45448a",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Google Provider
const provider = new GoogleAuthProvider();


// GOOGLE LOGIN


const googleBtn = document.getElementById("googleLoginBtn");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      alert("Welcome " + user.displayName);

      window.location.href = "../index.html";

    } catch (error) {

      alert(error.message);

    }
  });
}



// SIGN UP

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account Created Successfully");

      window.location.href = "./signin.html";

    } catch (error) {

      alert(error.message);

    }

  });

}



// SIGN IN


const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful");

      window.location.href = "../index.html";

    } catch (error) {

      alert(error.message);

    }

  });

}

//forgot pwd
const forgotPasswordBtn =
document.getElementById("forgotPassword");

if(forgotPasswordBtn){

    forgotPasswordBtn.addEventListener("click",
    async (e)=>{

        e.preventDefault();

        const email = prompt(
            "Enter your registered email:"
        );

        if(!email){
            return;
        }

        try{

            await sendPasswordResetEmail(
                auth,
                email
            );

            alert(
             "Password reset email sent successfully."
            );

        }catch(error){

            alert(error.message);

        }

    });

}

//user section check
onAuthStateChanged(auth, (user) => {

    if(user){

        console.log("User Logged In:", user.email);

    }else{

        console.log("No User Logged In");

    }

});

//user mail

const userEmail = document.getElementById("userEmail");
const userName = document.getElementById("userName");
const userPhoto = document.getElementById("userPhoto");
const userPhone = document.getElementById("userPhone");
const bookingCount = document.getElementById("bookingCount");
const favCount = document.getElementById("favCount");

onAuthStateChanged(auth, (user) => {

    if(user && userEmail){

        // Email
        userEmail.textContent = user.email;

        // Name
        userName.textContent =
        user.displayName || "Parking User";

        // Profile Photo
        if(user.photoURL){
            userPhoto.src = user.photoURL;
        }

        // Phone
        userPhone.textContent =
        user.phoneNumber || "Not Available";

        // Booking Count
        let bookings =
        JSON.parse(localStorage.getItem("bookingHistory")) || [];

        bookingCount.textContent =
        bookings.length;

        // Favourite Count
        let totalFav = 0;

        Object.keys(localStorage).forEach(key=>{

            if(
                key.startsWith("fav-") &&
                localStorage.getItem(key)=="true"
            ){
                totalFav++;
            }

        });

        favCount.textContent =
        totalFav;

    }

});



//logout fun
const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",
async ()=>{

try{

await signOut(auth);

alert("Logout Successful");

window.location.href =
"signin.html";

}catch(error){

alert(error.message);

}

});

}

//history btn
const historyBtn =
document.getElementById("historyBtn");

if(historyBtn){

historyBtn.addEventListener("click",()=>{

window.location.href =
"history.html";

});

}

//fav btn
const favoriteBtn =
document.getElementById("favoriteBtn");

if(favoriteBtn){

favoriteBtn.addEventListener("click",()=>{

window.location.href =
"favorites.html";

});

}

//setting btn
const settingBtn =
document.getElementById("settingBtn");

if(settingBtn){

settingBtn.addEventListener("click",()=>{

window.location.href =
"settings.html";

});

}