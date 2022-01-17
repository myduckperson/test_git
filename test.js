import {AuthorizedPopup, signOutExp, checkUser, onAuthStateChangedCustom, checkUserVersion, mergeDocs} from "./firebaseConfigProto.js";
import { checkUserOnSignIn } from "./firebaseFirestore.js";
// AuthorizedPopup().then(result => console.log(result.user.uid)).catch(err => console.log(err));
// signOutExp()
// .then(() => localStorage.clear())
// .then(() => console.log("logged out"))
// .catch(err => console.log("didnt logged out due to error", err));
const btn = document.getElementById("signIn&Out");
btn.addEventListener("click", checkUser);
onAuthStateChangedCustom(user => {
    // ця функція використовується тільки для того щоб отримати ініціювати об'єкт користувача
    // (вона не призначена для цього, але потрібна тут як "workaround",
    // із-за танців з бубном навколо асинхронних процесів)
    // після умовної реєстрації користувача через сервіси гугл
    // (коли користувач увійшов вперше)
    // задається змінна у локальне сховище, щоб не перевіряти версію щойно створеного користувача

    const recentlyRegistrated = JSON.parse(localStorage.getItem("recentlyRegistrated"))
    if(recentlyRegistrated && (typeof recentlyRegistrated) === "boolean"){
        localStorage.setItem("recentlyRegistrated", "false");
        return;
    }else{
        const uid = user.uid;
        const userDocLocal = localStorage.getItem("userDoc");
        // якщо локальні дані не задані (undefined), то 
        // функція викличе запит для потрібних їй даних 
        // ()
        const returnValue = checkUserVersion(uid, "template", userDocLocal);
        const correctVersion = returnValue[0] // boolean
        // якщо дані було не задано локально, то для того щоб далі
        // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
        const userDoc = returnValue[1];
        const templateDoc = returnValue[2];
        if(!correctVersion){
            mergeDocs(uid, userDoc, templateDoc);
        };
    }
});


