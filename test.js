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
    // .then(result => {
    //     const user = result.user;
    //     console.log(user);
    //     checkUserOnSignIn(user.uid, user.displayName)
    //     .then(async function(returnValue) {
    //         const output = await checkUserVersion(user.uid, returnValue[1]);
    //         if(returnValue[0] && output[0]){
    //             localStorage.setItem("userData", JSON.stringify(returnValue[1]));
    //         }else if(returnValue[0]){

    //         }else{
    //             createUser(user.uid, user.displayName);
    //             console.log("value set to true");
    //             // localStorage.setItem("recentlyRegistrated", "true");
    //         };
    //     });
    // })
    .then(() => {
        btn.innerText = logoutMsg;
        btn.addEventListener("click", signOutF, {once: true});
    })
    .catch(err => btn.addEventListener("click", signInPopup, {once: true}));

function signOutF(){
    signOutExp();
    localStorage.clear();
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

        const userDocLocal = JSON.parse(localStorage.getItem("userData"));
        if(!userDocLocal){
            // якщо даних в локальному сховищі неіснує при спрацьовуванні функції,
            // то користувач щойно ввійшов, бо при функція,
            // що спрацьовує при вході невстигає записати дані в локальне сховище,
            // бо onAuthStateChanged функція спрацьовує майже моментально
            const userExistOutput = await checkUserOnSignIn(user.uid, user.displayName)
            const userVersionOutput = await checkUserVersion(user.uid, userExistOutput[1]);

            // якщо локальні дані не задані (undefined), то 
            // функція викличе запит для потрібних їй даних 
            // const returnValue = await checkUserVersion(uid, userDocLocal);
            const correctVersion = userVersionOutput[0]; // boolean
            // якщо дані було не задано локально, то для того щоб далі
            // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
            const userDoc = userVersionOutput[1];
            const templateDoc = userVersionOutput[2];

            if(userExistOutput[0] && correctVersion){

                localStorage.setItem("userData", JSON.stringify(userExistOutput[1]));
            
            }else if(userExistOutput[0]){

                await mergeDocs(user.uid, userDoc, templateDoc);
                localStorage.setItem("userData", JSON.stringify(userDoc));
                
            }else{

                const userDoc = await createUser(user.uid, user.displayName);
                localStorage.setItem("userData", JSON.stringify(userDoc));
                
                // зберігає посилання на інформацію користувача у локальному сховищі
                // localStorage.setItem("userDataPath", user.uid);
            };
            // зберігає посилання на інформацію користувача у локальному сховищі
            localStorage.setItem("userDataPath", user.uid);
            changeBulbColor(userDoc.tasks['01_Form']['00']);
        }else{
            // якщо дані існують, то це означає, що AuthState змінилося із-за
            // перезавантаження сторінки
            const userVersionOutput = await checkUserVersion(user.uid, userDocLocal);
            // якщо локальні дані не задані (undefined), то 
            // функція викличе запит для потрібних їй даних 
            // const returnValue = await checkUserVersion(uid, userDocLocal);
            const correctVersion = userVersionOutput[0]; // boolean
            // якщо дані було не задано локально, то для того щоб далі
            // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
            const userDoc = userVersionOutput[1];
            const templateDoc = userVersionOutput[2];
            if(!correctVersion){
                await mergeDocs(user.uid, userDoc, templateDoc);
                localStorage.setItem("userData", JSON.stringify(userDoc));
            }
            changeBulbColor(userDoc.tasks['01_Form']['00']);
        }


        // console.log("regular");
        // const uid = user.uid;
        // // const userDataLocal = ().data();
        // // якщо локальні дані не задані (undefined), то 
        // // функція викличе запит для потрібних їй даних 
        // // const returnValue = await checkUserVersion(uid, userDocLocal);
        // const correctVersion = returnValue[0] // boolean
        // // якщо дані було не задано локально, то для того щоб далі
        // // не відсилати запит до бази даних ще раз функція повертаєті що використовувала  
        // const userDoc = returnValue[1];
        // const templateDoc = returnValue[2];
        // localStorage.setItem("userData", JSON.stringify(userDoc));
        btn.innerText = logoutMsg;
        btn.addEventListener("click", signOutF, {once: true});
    }else {
        console.log("anon");
        btn.innerText = loginMsg;
        btn.addEventListener("click", signInPopup, {once: true});
    }
});


function changeBulbColor(percent){
    const bulb = document.getElementById('bulb');
    if(percent <= 100 && percent >= 75){
        bulb.style.color = "green";
    }else if(percent < 75 && percent >= 50){
        bulb.style.color = "yellowgreen";
    }else if(percent < 50 && percent >= 25){
        bulb.style.color = "yellow";
    }else if(percent < 25 && percent > 0){
        bulb.style.color = "orange";
    }else if (percent == 0){
        bulb.style.color = "red";
    }
}