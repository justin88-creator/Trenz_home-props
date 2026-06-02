import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


// FIREBASE CONFIG
const firebaseConfig = {

apiKey:
"AIzaSyBd8tdjl7b8Pp65hsnlFtBmmKAPxnMRLM0",

authDomain:
"trenzorhomesadmin.firebaseapp.com",

projectId:
"trenzorhomesadmin",

storageBucket:
"trenzorhomesadmin.firebasestorage.app",

messagingSenderId:
"992246313430",

appId:
"1:992246313430:web:ea1390019bf9f8f7423477"

};


// INITIALIZE FIREBASE
const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(app);


// LOGIN FUNCTION
window.login =
function(){

const email =
document.getElementById(
"email"
).value;

const password =
document.getElementById(
"password"
).value;

const error =
document.getElementById(
"error"
);

signInWithEmailAndPassword(
auth,
email,
password
)

.then(() => {

error.style.color =
"green";

error.innerText =
"Login successful...";

setTimeout(() => {

window.location.href =
"controlRoom-x92";

}, 1000);

})

.catch((err) => {

error.style.color =
"red";

error.innerText =
"Wrong email or password";

console.log(err);

});

};