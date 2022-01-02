// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC6s_8U18Lo6t6OauWP_kpf0y0bpFThCrk",
    authDomain: "csvalidation-e182e.firebaseapp.com",
    projectId: "csvalidation-e182e",
    storageBucket: "csvalidation-e182e.appspot.com",
    messagingSenderId: "351738632285",
    appId: "1:351738632285:web:ae96a0a6d490cd3e5f15b4",
    measurementId: "G-973D5PX7XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const auth = getAuth(app);
// google pop up
// google pop up
// google pop up
const provider = new GoogleAuthProvider();
// sets pop up language
// auth.useDeviceLanguage();


import {checkUserOnSignIn, tasksLoad} from "./firebaseFirestore";

export async function popupGoogle(){

    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        checkUserOnSignIn(user.uid, user.displayName); 

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log("clicked the X");
        const btn = document.getElementById("signIn&Out");
        btn.addEventListener("click", popupGoogle, {once: true});
    });
};





const signOutVar = async function(){
    signOut(auth).then(() => {
        // future popUp here
      }).catch((error) => {
        // future error popUp here
      });
};


// checks user
// checks user
// checks user
export async function checkUserOnLoad(){
    onAuthStateChanged(auth, (user) => {
        const btn = document.getElementById("signIn&Out");
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            // ...
            btn.innerText = "SIGN OUT"
            console.log(uid, "user signed in");
            btn.addEventListener("click", signOutVar, {once: true});
            
            // завантажує опції з документу користувача
            const select = document.getElementById("task");
            const obj = "option";
            tasksLoad(select, obj, uid);
        } else {
            btn.innerText = "SIGN IN"
            btn.addEventListener("click", popupGoogle, {once: true});
            console.log("user is not signed in");

            // завантажує опціїї з шаблонного документу
            const select = document.getElementById("task");
            const obj = "option";
            tasksLoad(select, obj, "template");
        }
    });
};


