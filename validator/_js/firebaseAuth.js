// Import the functions you need from the SDKs you need
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



// Назва колекції документів з якою працює код
const main = "main";
// Назва шаблонного документу з якого створюють користувачів
const template = "template";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxDs2c5zvgXmaao6a2JpeSKmXL4OdmIIE",
    authDomain: "dev-validator-test.firebaseapp.com",
    databaseURL: "https://dev-validator-test.firebaseio.com",
    projectId: "dev-validator-test",
    storageBucket: "dev-validator-test.appspot.com",
    messagingSenderId: "313228527018",
    appId: "1:313228527018:web:3dbaefd97fe8b0f98dd7d3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
//Підключеня бази даних Firestore
const db = getFirestore(app);

// google pop up
const provider = new GoogleAuthProvider();
// sets pop up language
auth.useDeviceLanguage();

// checkUserOnLoad();

//import {checkUserOnSignIn, tasksLoad, checkUserVersion} from "./firebaseFirestore.js";

// відповідає за появу вікна для авторизації через гугл аккаунт 
export async function popupGoogle(){

    signInWithPopup(auth, provider)
    .then((result) => {
        // успішна авторизація
        const user = result.user;
        // createUser(user.uid, user.displayName);
        // window.location.reload();

        // перевіряє чи існує користувач в базі даних
        // checkUserOnSignIn повертає Promise та масив (
        // [0] - boolean (true - юзер існує),
        // [1] - якщо [0] true, то повертає дані користувача, якщо [0] false, то повертає uid 
        // [2] - якщо [0] false, то повертає ім'я та фамілію користувача з гугл аккаунту)
        checkUserOnSignIn(user.uid, user.displayName)
        .then(returnValue => {
            if(returnValue[0] && (checkUserVersion(user.uid, returnValue[1]))[0]){
                localStorage.setItem("userData", JSON.stringify(returnValue[1]));
                localStorage.setItem("userDataPath", user.uid);
            }else{
                createUser(user.uid, user.displayName);
                // console.log("value set to true");
                // localStorage.setItem("recentlyRegistrated", "true");
            };
        });
        //checkUserOnSignIn(user.uid, user.displayName); 

    }).catch((error) => {
        // помилка при авторизації
        console.log("clicked the X");
        const btn = document.getElementById("loginBtn");
        btn.addEventListener("click", popupGoogle, {once: true});

    });
};



// Створення нового користувача та копіювання бази даних з шаблону template 
// uid - отримуємо з LocalStorage
// userName - отримуємо  при авторизації з Гугл аккаунту
// async function createUser(uid, userName){
//     const userDoc = await getDoc( doc(db, "main", uid));
//     if(userDoc){
//         // version check
//     }else{
//         const template = (await getDoc( doc(db, "main", "template"))).data();
//         template.userName = userName;
//         template.uid = uid;
//         const ref = doc(db, "main", uid);
//         await setDoc(ref, template);        
//     } 
// }




// вихід користувача
const signOutVar = async function(){
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.reload();
        // showModalResults("template");
        // future popUp here
        }).catch(err => btn.addEventListener("click", signInPopup, {once: true}));
        // на помилку при вході заново прикріпляє слухача кліку кнопці
};


// спрацьовує на завантаженні сторінки
// перевіряє чи ввійшов користувач у систему
// перевіряє версію уже ввійшовшого користувача
export async function checkUserOnLoad(){
    onAuthStateChanged(auth, (user) => {
        const btn = document.getElementById("loginBtn");

        if (user) {
            const uid = user.uid;
            showModalResults(uid);

           
            // тепер кнопка відповідає за вихід користувача
            btn.innerText = "Вийти";
            console.log(uid, "user signed in");

            btn.addEventListener("click", signOutVar, {once: true});
            
            // завантажує опції з документу користувача

            const select = document.getElementById("task");
            const obj = "option";

            //виведення даних користувача в меню та модальне вікно
            const userName = document.getElementById("userName");
            userName.innerText = user.displayName;
            document.getElementById("userNameModal").innerText = user.displayName;
            


            // console.log(userDocLocal);
            const returnValue = await checkUserVersion(uid, userDocLocal);
            const correctVersion = returnValue[0]
            const userDoc = returnValue[1];
            const templateDoc = returnValue[2];
            // console.log(returnValue);
            if(!correctVersion){
                mergeDocs(uid, userDoc, templateDoc);
            }else{
                localStorage.setItem("userData", JSON.stringify(returnValue[1]));
            };
            
        } else {
            showModalResults("template");
            // тепер кнопка відповідає за вхід користувача
            btn.innerText = "Увійти";
            btn.addEventListener("click", popupGoogle, {once: true});
            console.log("user is not signed in");

            // завантажує опціїї з шаблонного документу
            //const select = document.getElementById("task");
            //const obj = "option";
            // tasksLoad(select, obj, "template");
        }
    });
};

// ------------------------------------------------------------------------------------

//Робота з базою даних

let uid = localStorage.getItem("userDataPath");

if(!uid){
    uid = "template";
};



//Get all documents in a collection
async function showModalResults(uid){

    
    // const docRef = db.collection("main").doc(uid);
    const docRef = doc(db, "main", uid);
    const templateDoc = await getDoc(docRef);
    
        if (templateDoc.exists) {
            //console.log("Document data:", doc.data());
            
            var tasksList = templateDoc.data().tasks;
            Object.entries(tasksList).sort().forEach(property => {
    
               let lessonsList = document.getElementById('userResult');
    
               //https://learn.javascript.ru/modifying-document Изменение документа
               //контейнер для відображення результатів
               let divLessons = document.createElement('div');
               divLessons.className = "divLessons";
               lessonsList.insertAdjacentElement('beforeend',divLessons);
    
               //Відображення назви курсу 
               const lessonName = property[0];    
               let divLessonName = document.createElement('div');
               divLessonName.id = lessonName;
               divLessonName.className = "divLessonName";               
               divLessons.insertAdjacentElement('afterbegin',divLessonName);
    
               let h3LessonName = document.createElement('h3');
               h3LessonName.innerHTML = lessonName;
               divLessonName.insertAdjacentElement('afterbegin',h3LessonName);
    
    
                //контейнер для відображення результатів завдань
                let divTasks = document.createElement('div');
                divTasks.className = "divTasks";
                divLessons.insertAdjacentElement('beforeend',divTasks);
              
                   
               Object.entries(property[1]).sort().forEach(property =>{
    
                //посилання на завдання
    
                let aTask = document.createElement('a');
                
                //умова на шлях до різних папок
                let path = window.location.href;
                let file = path.substring(path.length, path.length-8);
                
                if (file == 'task.php'){
                    aTask.href = "../../tasks/" + lessonName+"_" + property[0] + "/task.php";
                } else {
                    aTask.href = "tasks/" + lessonName+"_" + property[0] + "/task.php";
                }
                
                aTask.class = "a-class";
                divTasks.insertAdjacentElement('beforeend',aTask);
                let divTaskResult = document.createElement('div');
                divTaskResult.id = lessonName + "_" + property[0];
                divTaskResult.className = "divTaskResult";                
                aTask.insertAdjacentElement('beforeend',divTaskResult);
                
                //заголовок назва завдання
                let h4TaskName = document.createElement('h3');
                h4TaskName.innerHTML = property[0];
                divTaskResult.insertAdjacentElement('afterbegin',h4TaskName);
    
                //результат виконання завдання
                let h5TaskResult = document.createElement('h5');
                h5TaskResult.innerHTML = property[1]+"%";
                divTaskResult.insertAdjacentElement('beforeend',h5TaskResult);
    
                //графічне відображення прогресу https://ru.stackoverflow.com/questions/110066/%D0%9A%D0%B0%D0%BA-%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C-%D1%84%D0%BE%D0%BD-%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0-div-html-%D0%BD%D0%B5-%D0%B4%D0%BE-%D0%BA%D0%BE%D0%BD%D1%86%D0%B0
                let progress = document.createElement('progress');
                progress.min = 0;
                progress.max = 100;
                progress.value = property[1];
                divTaskResult.insertAdjacentElement('beforeend',progress);
    
                //console.log(property[0],":", property[1]);
               })
    
            });  
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    

}












// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
// the property of Ihor Illarionov
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
    
            }else if(mergeInPropertyObj !== undefined || mergeInPropertyObj !== null){
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
    
        // зберігає посилання на інформацію користувача у локальному сховищі
        localStorage.setItem("userDataPath", uid);
        const templateDocData = (await getDoc(doc(db, main, template))).data();
    
        // зберігає інформацію користувача у локальне сховище
        localStorage.setItem("userData", JSON.stringify(templateDocData));
        // let uDoc = templateDoc.dat;
    
        // додає шаблону айді
        templateDocData.userName = userName;
        templateDocData.uid = uid;
    
        // створює інформацію користувача
        console.log(templateDocData);
        await setDoc(doc(db, main, uid), templateDocData);
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
    
    