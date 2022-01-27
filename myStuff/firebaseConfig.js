// // firebase import template
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
// import { doc, getDoc, addDoc , updateDoc, getFirestore, query, getDocs, where, collection, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

// // config of CSValidation project on firebase

// const firebaseConfig = {
//     apiKey: "AIzaSyC6s_8U18Lo6t6OauWP_kpf0y0bpFThCrk",
//     authDomain: "csvalidation-e182e.firebaseapp.com",
//     projectId: "csvalidation-e182e",
//     storageBucket: "csvalidation-e182e.appspot.com",
//     messagingSenderId: "351738632285",
//     appId: "1:351738632285:web:ae96a0a6d490cd3e5f15b4",
//     measurementId: "G-973D5PX7XX"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();




// local import

// перевірка війшовшого користувача 
// реєстрація користувача при потребі
// також перевіряє версію даних користувача
import { checkUserOnLoad } from "./firebaseAuth.js";
checkUserOnLoad();



// відправка результатів через формочку

import { sendResult } from "./sendResults.js";
import { tasksLoad } from "./firebaseFirestore.js";

const sendBtn = document.getElementById("submit");
sendBtn.addEventListener("click", formSubmit);

async function formSubmit(){
    const taskSelect = document.getElementById("task");
    // існує метод для конкретного значеня (value) обраної опції,
    // але він не підходить для отримання самого обраного HTML об'єкту,
    // тому використано методи подані нижче (береться індекс обраної опції 
    // та шукається в масиві опцій)
    const selOpt = taskSelect.options[taskSelect.selectedIndex];
    const range = document.getElementById("range");

    sendResult(selOpt.taskTheme, selOpt.task, range.value);
}

// відображення результатів

const btn = document.getElementById("showBtn");
btn.addEventListener("click", showResult);

function showResult(){
    const uid = localStorage.getItem("userDataPath");
    const box = document.getElementById("box");
    const obj1 = "div";
    tasksLoad(box, obj1, uid);
}
