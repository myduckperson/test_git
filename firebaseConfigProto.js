import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, getIdToken, reload, getIdTokenResult, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
import { doc, getDoc, updateDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"
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
export const onAuthStateChangedCustom = funct => onAuthStateChanged(auth, funct);
export async function checkUserVersion(uid, templateString, userDoc, templateDoc){
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
            templateDoc = ( await getDoc( doc(db, "main", templateString) ) ).data();
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

// нажаль ця функція зміннює вхідні об'єкти 
// (наразі проблем з цим немає, але можуть виникнути у майбутньому)
// я намагався зробити її через функційне програмування,
// але мені не вистачає часу це доробити, тому поки що залишив так
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

        }else if(Array.isArray(mergeFromPropertyObj)){
            // якщо властивість має непримітивне значення (масив)
            // надає властивості шаблонного об'єкту масив неповторних значень
            mergeFrom[`${property[0]}`] = mergeUnique(mergeFromPropertyObj,mergeInPropertyObj);

        }else if(mergeInPropertyObj){
            // якщо властивість має примітивне значення
            // якщо значення другого об'єкту існує
            // надає властивості шаблонного об'єкту значення другого об'єкту
            mergeFrom[`${property[0]}`] = mergeInPropertyObj;
        };
    });
    // повертає зміненний шаблонний об'єкт
    return mergeFrom;
};

// вкрадено з https://stackoverflow.com/a/44464083
function mergeUnique(arr1, arr2){
    return arr1.concat(arr2.filter(function (item) {
        return arr1.indexOf(item) === -1;
    }));
};

// є можливість прикрутити локальне сховище для templateDocument
// коли один комп'ютер використовується багатьма учнями
// Створює документ користувача
export async function createUser(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації

    // зберігає посилання на інформацію користувача у локальному сховищі
    localStorage.setItem("userDataPath", uid);
    const templateDocData = (await getDoc(doc(db, "main", "template"))).data();

    // зберігає інформацію користувача у локальне сховище
    localStorage.setItem("userData", `${JSON.stringify(docSnap.data())}`);
    // let uDoc = templateDoc.dat;

    // додає шаблону айді
    templateDocData.userName = userName;
    templateDocData.uid = uid;

    // створює інформацію користувача
    await setDoc(doc(db, "main", uid), templateDocData);
};

export async function checkUserOnSignIn(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації
    const theDoc = (await getDoc( doc(db, "main", uid) )).data();

    if(!theDoc){
        return [false, uid, userName];
        console.log("bruh")
        createUser(uid, userName);
    }else{
        return [true, theDoc];
        // checkUserVersion(theDoc, null, uid, true);
        // console.log("double bruh");
    }
};



// завантажує усі завдання (та їх значення у документі) у обранний об'єкт
export async function tasksLoad(path, tag, uid, userDoc){
    // path - об'єкт батько для завантаження завдань
    // tag - HTML тег у якому буде запаковане завдання 
    // uid - посилання на документ (userId)
    if(!userDoc){
        const docSnap = (await getDoc( doc(db, "main", uid) )).data();  
    }
    // проходиться по кожній властивості документа
    // потім сортує від найменшого до найбільшого
    // сортування не працює потім пофікшу
    Object.entries(docSnap.tasks)
    .sort((a,b) => Number(a[0].substring(0,2)) - Number(b[0].substring(0, 2))) 
    .forEach(obj => {
        // із-за того що MAP об'єкт має як назву так і властивості,
        // функція вище повертає масив (властивостей документу)
        // масивів (назви та властивостей MAP об'єкту )
        // в нашому випадку назва MAP - це загальна тема завдань (01_Form),
        // а властивості MAP - це  власне завдання (00, 01, 02, 03)
        Object.entries(obj[1]).sort((a, b) => 
            Number(a[0]) - Number(b[0])
        )
        .forEach(task => {
            // вставляє данні у потрібний об'єкту в потрібні теги
            const child = document.createElement(tag);
            child.innerText = `${obj[0]}_${task[0]}: ${task[1]}%`;
            child.taskTheme = obj[0];
            child.task = task[0];
            path.append(child);
        }); 
    });
};


export async function sendResuld(taskTheme, task, result){
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
export async function sendResult(taskTheme, task, result, uid, userDocData){
    userDocData = JSON.parse(localStorage.getItem("userData"));
    const userDocPath = JSON.parse(localStorage.getItem("userDataPath"));
    if(!userDoc && uid && !userDocData){
        userDocData = (await getDoc( doc(db, "main", uid) )).data();
    }else if(!userDoc && !uid && !userDocData && userDocPath){
        userDocData = (await getDoc( doc(db, "main", userDocPath) )).data();
    }
    userDocData.tasks[taskTheme][task] = Number(result);
    localStorage.setItem("userData",JSON.stringify(userDocData));
    await updateDoc(theDocRef, theDocTemplate);
}   
