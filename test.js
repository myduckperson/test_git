import {AuthorizedPopup, signOutExp, checkUser, onAuthStateChange} from "./firebaseConfigProto.js";
// AuthorizedPopup().then(result => console.log(result.user.uid)).catch(err => console.log(err));
// signOutExp()
// .then(() => localStorage.clear())
// .then(() => console.log("logged out"))
// .catch(err => console.log("didnt logged out due to error", err));
const btn = document.getElementById("signIn&Out");
btn.addEventListener("click", checkUser);
onAuthStateChange(user => console.log(user.uid))


