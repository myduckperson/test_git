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

// Назва колекції документів з якою працює код
const main = "main";
// Назва шаблонного документу з якого створюють користувачів
const template = "template";

export const AuthorizedPopup = () => signInWithPopup(auth, provider);

export const signOutExp = () => signOut(auth);
export const checkUser = () => console.log(auth.currentUser);
// При використанні потребує функцію як аргумент
// При зміні та виході з аккаунту, або при завантаженні сторінки
// Спрацьовує подана функція
export const onAuthStateChangedCustom = funct => onAuthStateChanged(auth, funct);
export async function checkUserVersion(uid, userDoc, templateDoc){
// uid - айді користувача
// userDoc - об'єкт даних користувача
// templateDoc - об'єкт шаблонних даних
    if(!uid && !userDoc){
        console.error("to check version you have to provide uid or userDoc");
        return;
    }
    if(!userDoc){
        try{
            userDoc = ( await getDoc( doc(db, main, uid) ) ).data();      
        }catch(err){
            console.error(err);
            return;
        }
    }
    if(!templateDoc){
        try{
            templateDoc = ( await getDoc( doc(db, main, template) ) ).data();
        }catch(err){
            console.error(err);
        }
    }
    console.log(templateDoc.version == userDoc.version, templateDoc.version, userDoc);
    if(templateDoc.version == userDoc.version){
        return [true, userDoc, templateDoc];
    }else{
        return [false, userDoc, templateDoc];
    }
};

// Перевіряє чи існує документ даних користувача в базі даних
export async function checkUserOnSignIn(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації
    const theDoc = (await getDoc( doc(db, main, uid) )).data();

    if(!theDoc){
        return [false, uid, userName];
        // createUser(uid, userName);
    }else{
        return [true, theDoc];
        // checkUserVersion(theDoc, null, uid, true);
    }
};

export async function mergeDocs(uid, userDoc, templateDoc){
    if(!uid && !userDoc){
        console.error("to merge template into userDoc you have to provide uid or userDoc");
        return;
    }
    if(!userDoc){
        userDoc = ( await getDoc( doc(db, main, uid) ) ).data();
    }
    if(!templateDoc){
        templateDoc = ( await getDoc( doc(db, main, template) ) ).data();
    }
    console.log(templateDoc, userDoc);
    userDoc.version = templateDoc.version;
    const mergedObject = mergeObjects(templateDoc, userDoc);
    console.log(mergedObject);
    // return mergeObjects(templateDoc, userDoc);
    await setDoc(doc(db, main, uid), mergedObject);
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
    // console.log(mergeFrom,mergeIn);
    console.log(JSON.stringify(mergeFrom),JSON.stringify(mergeIn));
    Object.entries(mergeFrom).forEach(property => {
        // console.log(mergeIn);
        const mergeInPropertyObj = mergeIn[property[0]];
        // console.log(mergeInPropertyObj);
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
            mergeFrom[property[0]] = mergeUnique(mergeFromPropertyObj,mergeInPropertyObj);

        }else if(mergeInPropertyObj !== undefined && mergeInPropertyObj !== null){
            // якщо властивість має примітивне значення
            // якщо значення другого об'єкту існує
            // надає властивості шаблонного об'єкту значення другого об'єкту
            console.log(mergeInPropertyObj, property[0]);
            mergeFrom[property[0]] = mergeInPropertyObj;
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

// Створює документ користувача
export async function createUser(uid, userName){
    // uid - посилання на документ (userId), отримане при авторизації
    // userName - ім'я користувача, отримане при авторизації


    const templateDocData = (await getDoc(doc(db, main, template))).data();

    // зберігає інформацію користувача у локальне сховище
   // let uDoc = templateDoc.dat;

    // додає шаблону айді
    templateDocData.userName = userName;
    templateDocData.uid = uid;

    // створює інформацію користувача
    await setDoc(doc(db, main, uid), templateDocData);
    return templateDocData;
};




// завантажує усі завдання (та їх значення у документі) у обранний об'єкт
export async function tasksLoad(path, tag, uid, userDoc){
    // path - об'єкт батько для завантаження завдань
    // tag - HTML тег у якому буде запаковане завдання 
    // uid - посилання на документ (userId)
    if(!userDoc){
        const userDoc = (await getDoc( doc(db, main, uid) )).data();  
    }
    // проходиться по кожній властивості документа
    // потім сортує від найменшого до найбільшого
    // сортування не працює потім пофікшу
    Object.entries(userDoc.tasks)
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


// Оновлює властивості у поданому через аргументи завданні
export async function sendResult(taskTheme, task, result, uid, userDocData){
    userDocData = JSON.parse(localStorage.getItem("userData"));
    const userDocPath = JSON.parse(localStorage.getItem("userDataPath"));
    if(!userDoc && uid && !userDocData){
        userDocData = (await getDoc( doc(db, main, uid) )).data();
    }else if(!userDoc && !uid && !userDocData && userDocPath){
        userDocData = (await getDoc( doc(db, main, userDocPath) )).data();
    }
    userDocData.tasks[taskTheme][task] = Number(result);
    localStorage.setItem("userData",JSON.stringify(userDocData));
    await updateDoc(theDocRef, theDocTemplate);
}   
