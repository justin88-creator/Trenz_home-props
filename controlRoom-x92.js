import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged
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

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);


// AUTO LOGIN CHECK
onAuthStateChanged(
auth,
(user) => {

if(user){

window.location.href =
"vault-t92-admin.html";

}

}
);


// LOGIN
document.getElementById(
"loginBtn"
).addEventListener(
"click",
async () => {

const email =
document.getElementById(
"adminEmail"
).value;

const password =
document.getElementById(
"adminPassword"
).value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href =
"vault-t92-admin.html";

}catch(error){

alert(
"Incorrect email or password"
);

console.error(error);

}

}
);