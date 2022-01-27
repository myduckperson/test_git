// // firebase import
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { doc, getDoc, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

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

// // завантажує усі завдання (та їх значення у документі) у обранний об'єкт
// export async function tasksLoad(path, tag, uid){
//     // path - об'єкт батько для завантаження завдань
//     // tag - HTML тег у якому буде запаковане завдання 
//     // uid - посилання на документ (userId)
//     const docRef = doc(db, "main", uid);
//     const docSnap = await getDoc(docRef);

//     // проходиться по кожній властивості документа
//     // потім сортує від найменшого до найбільшого
//     console.log(docSnap.data())
//     Object.entries(docSnap.data().tasks)
//     .sort((a,b) => Number(a[0].substring(0,2)) - Number(b[0].substring(0, 2))) 
//     .forEach(obj => {
//         // із-за того що MAP об'єкт має як назву так і властивості,
//         // функція вище повертає масив (властивостей документу)
//         // масивів (назви та властивостей MAP об'єкту )
//         // в нашому випадку назва MAP - це загальна тема завдань (01_Form),
//         // а властивості MAP - це  власне завдання (00, 01, 02, 03)
//         Object.entries(obj[1]).sort((a, b) => 
//             Number(a[0]) - Number(b[0])
//         )
//         .forEach(task => {
//             // вставляє данні у потрібний об'єкту в потрібні теги
//             const child = document.createElement(tag);
//             child.innerText = `${obj[0]}_${task[0]}: ${task[1]}%`;
//             child.taskTheme = obj[0];
//             child.task = task[0];
//             path.append(child);
//         }); 
//     });
// };



// // Знаходить інформацію користувача в базі даних
// // Якщо інформації користувача не існує (тобто новий користувач),
// // то створити інформацію з шаблону
// export async function checkUserOnSignIn(uid, userName){
//     // uid - посилання на документ (userId), отримане при авторизації
//     // userName - ім'я користувача, отримане при авторизації
//     const docRef = doc(db, "main", uid);
//     const theDoc = await getDoc(docRef);

//     if(!theDoc.data()){
//         console.log("bruh")
//         createUser(uid, userName);
//     }else{
//         checkUserVersion(theDoc, null, uid, true);
//         console.log("double bruh");
//     }
// };
// // Створює документ користувача
// async function createUser(uid, userName){
//     // uid - посилання на документ (userId), отримане при авторизації
//     // userName - ім'я користувача, отримане при авторизації
//     const theDocRef = doc(db, "main", "template");
//     const docRef = doc(db, "main", `${uid}`);

//     // зберігає посилання на інформацію користувача у локальному сховищі
//     localStorage.setItem("userDataPath", `${uid}`);
//     const docSnap = await getDoc(theDocRef);

//     // зберігає інформацію користувача у локальне сховище
//     localStorage.setItem("userData", `${JSON.stringify(docSnap.data())}`);
//     let uDoc = docSnap.data();

//     // додає шаблону айді
//     uDoc.userName = userName;
//     uDoc.uid = uid;

//     // створює інформацію користувача
//     await setDoc(docRef, uDoc);
// };

// // перевіряє версію даних користувача
// export async function checkUserVersion(userDoc, templateDoc, uid, saveData){
//     // userDoc - дані користувача на сервері, якщо = null, або undefined,
//     // тоді виконується запит для отримання даних

//     // templateDoc - шаблон даних користувачів, якщо = null, або undefined,
//     // тоді виконується запит для отримання даних

//     // uid - айді користувача
//     // saveData = boolean
//     // якщо true, тоді синхронізує дані у локальному сховищі

//     console.log("attempt to change")
//     if(!userDoc){

//         const userDocRef = doc(db, "main", `${uid}`);
//         const docMat = await getDoc(userDocRef);
//         userDoc = docMat.data();
//         // із-за того, що створення 
//         console.log(userDoc._document);
//         console.log(userDoc, "something is  wrong");
//         if(!userDoc._document){
//             console.log("change failed");
//             return;
//         }; 

//     }
//     if(!templateDoc){
//         const templateRef = doc(db, "main", "template");
//         templateDoc = await getDoc(templateRef);   
//     }
//     console.log(userDoc.data(), templateDoc.data());
//     if(templateDoc.data().version !== userDoc.data().version){

//         // синхронізує локальні дані з глобальними 
//         const localData = userDoc;
//         // JSON.parse(localStorage.getItem("userData"));
//         const mergeFrom = templateDoc;
//         console.log(mergeFrom.tasks, localData.tasks, mergeFrom, localData)
//         const newLocalData = mergeObjects(mergeFrom.tasks, localData.tasks);
//         const ultimateData = localData;
//         ultimateData.tasks = newLocalData;
//         ultimateData.version = mergeFrom.version;
//         console.log(ultimateData);
//         localStorage.setItem("userData", `${JSON.stringify(newLocalData)}`);

//         // синхронізує дані користувача
//         const mergeRef = doc(db, "main", `${uid}`);
//         console.log(mergeFrom);
        
//         await setDoc(mergeRef, ultimateData, {merge: true});
    
//     }else if(templateDoc.version == userDoc.version && saveData){
//         // saves data
//         localStorage.setItem("userDataPath", `${uid}`);
//         localStorage.setItem("userData", `${JSON.stringify(userDoc)}`);
//     }
// }




// // поєднує значення двох об'єктів
// // (із-за того, що звичайні методи не можуть поєднувати вкладені об'єкти,
// // була створенна кастомна функція)
// export function mergeObjects(mergeFrom,mergeIn){
//     // mergeFrom - шаблон з новими властивостями
//     // mergeIn - об'єкт зі значеннями, які потрібно зберегти
//     // проходиться по кожній властивості mergeFrom 
//     // (припускається, що mergeFrom має більше властивостей, ніж mergeIn)
//     Object.entries(mergeFrom).forEach(property => {
//         console.log(mergeIn);
//         const mergeInPropertyObj = mergeIn[`${property[0]}`];
//         const mergeFromPropertyObj = property[1];
//         if(
//             typeof property == "object" &&
//             typeof mergeFromPropertyObj == "object" &&
//             !Array.isArray(mergeFromPropertyObj) &&
//             property !== null &&
//             mergeInPropertyObj
//         ){
//             // якщо властивість має непримітивне значення (об'єкт) 
//             // та якщо ця властивість має теж ім'я, що й у mergeIn 
//                 // якщо значення другого об'єкту існує
//                 // поєднує вкладені об'єкти 
//                 Object.assign(mergeFromPropertyObj, mergeInPropertyObj);            
//             // }
    
//         }else if(Array.isArray(mergeFromPropertyObj)){
//             // якщо властивість має непримітивне значення (масив)
//             // надає властивості шаблонного об'єкту масив неповторних значень
//             mergeFrom[`${property[0]}`] = mergeUnique(mergeFromPropertyObj,mergeInPropertyObj);

//         }else if(mergeInPropertyObj){
//             // якщо властивість має примітивне значення
//             // if(mergeInPropertyObj){
//                 // якщо значення другого об'єкту існує
//                 // надає властивості шаблонного об'єкту значення другого об'єкту
//                 mergeFrom[`${property[0]}`] = mergeInPropertyObj;
//             // };
//         };
//     });
//     // повертає зміненний шаблонний об'єкт
//     return mergeFrom;
// };
// /* недоліки:

// ------------ якщо mergeIn має прямі властивості, 
// що не властиві mergeFrom, тоді вони не будуть задані у mergeFrom на виході (за потреби можливо вирішити)

// */
// // вкрадено з stackOverflow
// // https://stackoverflow.com/a/44464083
// // з'єднує унікальні значення з двох масивів
// function mergeUnique(arr1, arr2){
//     return arr1.concat(arr2.filter(function (item) {
//         return arr1.indexOf(item) === -1;
//     }));
// };
