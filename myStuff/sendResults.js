import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { doc, getDoc, updateDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"
import { mergeObjects } from "./firebaseFirestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyC6s_8U18Lo6t6OauWP_kpf0y0bpFThCrk",
    authDomain: "csvalidation-e182e.firebaseapp.com",
    projectId: "csvalidation-e182e",
    storageBucket: "csvalidation-e182e.appspot.com",
    messagingSenderId: "351738632285",
    appId: "1:351738632285:web:ae96a0a6d490cd3e5f15b4",
    measurementId: "G-973D5PX7XX"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function sendResult(taskTheme, task, result){
    const docName = localStorage.getItem("userDataPath");
    // const localDoc = JSON.parse(localStorage.getItem("userData"));
    const theDocRef = doc(db, "main", `${docName}`);
    const theDoc = await getDoc(doc(db, "main", `${docName}`));
    const theDocTemplate = theDoc.data();
    // змінює об'єкт отриманої інформації та відправляє цей самий об'єкт
    // localDoc.tasks[taskTheme][task] = Number(result);
    theDocTemplate.tasks[taskTheme][task] = Number(result);
    localStorage.setItem("userData",JSON.stringify(theDocTemplate));
    await updateDoc(theDocRef, theDocTemplate);
};
