
// local import

// перевірка війшовшого користувача 
// реєстрація користувача при потребі
// // також перевіряє версію даних користувача
// import { checkUserOnLoad } from "./firebaseAuth.js";
// checkUserOnLoad();

// відправка результатів через формочку

// import { sendResult } from "./sendResults.js";
//import { tasksLoad } from "./firebaseFirestore.js";

// const sendBtn = document.getElementById("submit");
// sendBtn.addEventListener("click", formSubmit);

// async function formSubmit(){
//     const taskSelect = document.getElementById("task");
//     // існує метод для конкретного значеня (value) обраної опції,
//     // але він не підходить для отримання самого обраного HTML об'єкту,
//     // тому використано методи подані нижче (береться індекс обраної опції 
//     // та шукається в масиві опцій)
//     const selOpt = taskSelect.options[taskSelect.selectedIndex];
//     const range = document.getElementById("range");

//     sendResult(selOpt.taskTheme, selOpt.task, range.value);
// }

// відображення результатів

// const btn = document.getElementById("showBtn");
// btn.addEventListener("click", showResult);

// function showResult(){
//     const uid = localStorage.getItem("userDataPath");
//     const box = document.getElementById("box");
//     const obj1 = "div";
//     tasksLoad(box, obj1, uid);
// }