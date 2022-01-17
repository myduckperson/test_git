import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, getIdToken, reload, getIdTokenResult, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"
// import { mergeObjects } from "./firebaseFirestore.js";

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
const db = getFirestore(app);


// AuthorizedPopup()
// .then(() => console.log("bruh"));



export const AuthorizedPopup = () => signInWithPopup(auth, provider);

// How AuthorizedPopupDec would look like without usage of arrow function

// export const AuthorizedPopupDec = function(){
//     return new Promise(
//     function(resolve,reject){
//          signInWithPopup(auth, provider)
//          .then(function(result) {
//              resolve(result)
//          })
//          .catch(function(err) {
//              reject(err)
//          })
//      });
// };

console.log( await checkUserVersion("dvkRF5fyZZSdUoh9Cb99iq1gH0L2"));
export const signOutExp = () => signOut(auth);
export const checkUser = () => console.log(auth.currentUser);
export const onAuthStateChange = funct => onAuthStateChanged(auth, funct);
export async function checkUserVersion(uid, userDoc, templateDoc){
    if(!uid && !userDoc){
        console.error("to check version you have to provide uid or userDoc");
        return;
    }
    if(!userDoc){
        try{
            userDoc = ( await getDoc( doc(db, "main", uid) ) ).data();      
        }catch(err){
            console.error(err);
            return;
        }
    }
    if(!templateDoc){
        try{
            templateDoc = ( await getDoc( doc(db, "main", "template") ) ).data();
        }catch(err){
            console.error(err);
        }
    }
    if(templateDoc.version == userDoc.version){
        return [true, userDoc, templateDoc];
    }else{
        return [false, userDoc, templateDoc];
    }
};
export async function mergeDocs(uid, userDoc, templateDoc){
    if(!uid && !userDoc){
        console.error("to merge template into userDoc you have to provide uid or userDoc");
        return;
    }
    if(!userDoc){
        userDoc = ( await getDoc( doc(db, "main", uid) ) ).data();
    }
    if(!templateDoc){
        templateDoc = ( await getDoc( doc(db, "main", "template") ) ).data();
    }
    return mergeObjects(templateDoc, userDoc);
}
const bro = {
    "boddies":[
        "boddy0",
        "boddy1"
    ],
    "age": 20,
    "body":{
        "strong": true,
        "health":{
            // "ill":false,
            "alive":true
        }
    }
}

const badBro = {
    "boddies":[
        "boddy0",
        "boddy1",
        "boddy2"
    ],
    "xd":true,
    "age": 30,
    "body":{
        "strong": false,
        "health":{
            "ill":true,
            "alive":true,
            "fat":true
        }
    }
}

console.log(mergeObjects(badBro,bro));
export function mergeObjects(mergeFrom,mergeIn){
    // mergeFrom - шаблон з новими властивостями
    // mergeIn - об'єкт зі значеннями, які потрібно зберегти
    // проходиться по кожній властивості mergeFrom 
    // (припускається, що mergeFrom має більше властивостей, ніж mergeIn)
    Object.entries(mergeFrom).forEach(property => {
        // console.log(mergeIn);
        const mergeInPropertyObj = mergeIn[`${property[0]}`];
        const mergeFromPropertyObj = property[1];
        if(
            typeof property == "object" &&
            typeof mergeFromPropertyObj == "object" &&
            !Array.isArray(mergeFromPropertyObj) &&
            property !== null &&
            mergeInPropertyObj
        ){
            // якщо властивість має непримітивне значення (об'єкт) 
            // та якщо ця властивість має теж ім'я, що й у mergeIn 
                // якщо значення другого об'єкту існує
                // поєднує вкладені об'єкти 
                mergeObjects(mergeFromPropertyObj, mergeInPropertyObj);            
            // }
    
        }else if(Array.isArray(mergeFromPropertyObj)){
            // якщо властивість має непримітивне значення (масив)
            // надає властивості шаблонного об'єкту масив неповторних значень
            mergeFrom[`${property[0]}`] = mergeUnique(mergeFromPropertyObj,mergeInPropertyObj);

        }else if(mergeInPropertyObj){
            // якщо властивість має примітивне значення
            // if(mergeInPropertyObj){
                // якщо значення другого об'єкту існує
                // надає властивості шаблонного об'єкту значення другого об'єкту
                mergeFrom[`${property[0]}`] = mergeInPropertyObj;
            // };
        };
    });
    // повертає зміненний шаблонний об'єкт
    return mergeFrom;
};

function mergeUnique(arr1, arr2){
    return arr1.concat(arr2.filter(function (item) {
        return arr1.indexOf(item) === -1;
    }));
};