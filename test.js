import {AuthorizedPopup, signOutExp, checkUser, checkUserOnSignIn, onAuthStateChangedCustom, checkUserVersion, mergeDocs, createUser} from "./firebaseConfigProto.js";
// import { checkUserOnSignIn } from "./firebaseFirestore.js";
// AuthorizedPopup().then(result => console.log(result.user.uid)).catch(err => console.log(err));
// signOutExp()
// .then(() => localStorage.clear())
// .then(() => console.log("logged out"))
// .catch(err => console.log("didnt logged out due to error", err));

const loginMsg = "sign in";
const logoutMsg = "sign out";

const btn = document.getElementById("signIn&Out");


console.time;


const signInPopup = () => 
    AuthorizedPopup()
    .then(result => {
        const user = result.user;
        // console.log(user);
        checkUserOnSignIn(user.uid, user.displayName)
        .then(returnValue => {
            if(returnValue[0] && (checkUserVersion(user.uid, returnValue[1]))[0]){
                localStorage.setItem("userData", JSON.stringify(returnValue[1]));
            }else{
                createUser(user.uid, user.displayName);
                console.log("value set to true");
                // localStorage.setItem("recentlyRegistrated", "true");
            };
        });
    })
    .then(() => {
        btn.innerText = logoutMsg;
        btn.addEventListener("click", signOutF, {once: true});
    })
    .catch(err => btn.addEventListener("click", signInPopup, {once: true}));

function signOutF(){
    signOutExp();
    this.addEventListener("click", signInPopup, {once: true});
};

// btn.addEventListener("click", signInPopup, {once: true});


onAuthStateChangedCustom(async function(user){
    // ця функція використовується тільки для того щоб отримати ініціювати об'єкт користувача
    // (вона не призначена для цього, але потрібна тут як "workaround",
    // із-за танців з бубном навколо асинхронних процесів)
    // після умовної реєстрації користувача через сервіси гугл
    // (коли користувач увійшов вперше)
    // задається змінна у локальне сховище, щоб не перевіряти версію щойно створеного користувача
    // console.log(user);
    // const recentlyRegistrated = JSON.parse(localStorage.getItem("recentlyRegistrated"))
    // if(recentlyRegistrated && (typeof recentlyRegistrated) === "boolean" && user){
    //     console.log("value set to false");
    //     localStorage.setItem("recentlyRegistrated", "false");
    //     btn.innerText = logoutMsg;
    //     btn.addEventListener("click", signOutF, {once: true});
    //     console.log("created", JSON.parse(localStorage.getItem("recentlyRegistrated")));
    //     return;
    // }else 
    if(user){
        console.log("regular");
        const uid = user.uid;
        const userDocLocal = JSON.parse(localStorage.getItem("userData"));
        // якщо локальні дані не задані (undefined), то 
        // функція викличе запит для потрібних їй даних 
        console.log(userDocLocal);
        const returnValue = await checkUserVersion(uid, userDocLocal);
        const correctVersion = returnValue[0] // boolean
        // якщо дані було не задано локально, то для того щоб далі
        // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
        const userDoc = returnValue[1];
        const templateDoc = returnValue[2];
        console.log(returnValue);
        if(!correctVersion){
            mergeDocs(uid, userDoc, templateDoc);
        };
        btn.innerText = logoutMsg;
        btn.addEventListener("click", signOutF, {once: true});
    }else {
        console.log("anon");
        btn.innerText = loginMsg;
        btn.addEventListener("click", signInPopup, {once: true});
    }
});



