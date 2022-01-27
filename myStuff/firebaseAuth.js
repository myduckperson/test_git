// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, getIdToken, reload, getIdTokenResult, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"

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
const provider = new GoogleAuthProvider();
// sets pop up language
auth.useDeviceLanguage();


import {checkUserOnSignIn, tasksLoad, checkUserVersion} from "./firebaseFirestore.js";

// відповідає за появу вікна для авторизації через гугл аккаунт 
export async function popupGoogle(){

    signInWithPopup(auth, provider)
    .then((result) => {
        // успішна авторизація
        const user = result.user;
        checkUserOnSignIn(user.uid, user.displayName); 

    }).catch((error) => {
        // помилка при авторизації
        console.log("clicked the X");
        const btn = document.getElementById("signIn&Out");
        btn.addEventListener("click", popupGoogle, {once: true});

    });
};




// вихід користувача
const signOutVar = async function(){
    signOut(auth).then(() => {
        localStorage.clear();
            // future popUp here
        }).catch((error) => {
            // future error popUp here
        });
};


// спрацьовує на завантаженні сторінки
// перевіряє чи ввійшов користувач у систему
// перевіряє версію уже ввійшовшого користувача
export async function checkUserOnLoad(){
    onAuthStateChanged(auth, (user) => {
        const btn = document.getElementById("signIn&Out");
        if (user) {

            const uid = user.uid;
            // тепер кнопка відповідає за вихід користувача
            btn.innerText = "SIGN OUT"
            console.log(uid, "user signed in");
            btn.addEventListener("click", signOutVar, {once: true});
            
            // завантажує опції з документу користувача

            checkUserVersion(null, null, uid, false);
            const select = document.getElementById("task");
            const obj = "option";
            // tasksLoad(select, obj, uid);
        } else {
            
            // тепер кнопка відповідає за вхід користувача
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


