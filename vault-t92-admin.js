```javascript
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
signOut
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


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


// INITIALIZE
const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);


// CLOUDINARY
const CLOUD_NAME =
"dz4ksfngd";

const UPLOAD_PRESET =
"trenz_upload";


// DOM
const uploadBtn =
document.getElementById(
"uploadBtn"
);

const propertyList =
document.getElementById(
"propertyList"
);


// LOGOUT
document.getElementById(
"logoutBtn"
).addEventListener(
"click",
async () => {

await signOut(auth);

window.location.href =
"controlRoom-x92.html";

}
);


// LOAD PROPERTIES
async function loadProperties(){

propertyList.innerHTML =
"Loading properties...";

const snapshot =
await getDocs(
collection(
db,
"properties"
)
);

propertyList.innerHTML =
"";

snapshot.forEach(docSnap => {

const property =
docSnap.data();

propertyList.innerHTML += `

<div class="property-item">

<div>

<h3>
${property.title}
</h3>

<p>
${property.location}
</p>

<p>
${property.price}
</p>

</div>

<button
class="delete-btn"
onclick="deleteProperty('${docSnap.id}')">

Delete

</button>

</div>

`;

});

}

loadProperties();


// DELETE PROPERTY
window.deleteProperty =
async function(id){

const confirmDelete =
confirm(
"Delete this property?"
);

if(!confirmDelete)
return;

await deleteDoc(
doc(
db,
"properties",
id
)
);

alert(
"Property deleted"
);

loadProperties();

};


// UPLOAD PROPERTY
uploadBtn.addEventListener(
"click",
async () => {

uploadBtn.innerText =
"Uploading...";


const title =
document.getElementById(
"title"
).value;

const location =
document.getElementById(
"location"
).value;

const price =
document.getElementById(
"price"
).value;

const bedrooms =
parseInt(
document.getElementById(
"bedrooms"
).value
);

const bathrooms =
parseInt(
document.getElementById(
"bathrooms"
).value
);

const size =
document.getElementById(
"size"
).value;

const status =
document.getElementById(
"status"
).value;

const description =
document.getElementById(
"description"
).value;

const imageFiles =
document.getElementById(
"images"
).files;


// VALIDATION
if(
!title ||
!location ||
!price ||
!bedrooms ||
!bathrooms ||
!size ||
!description ||
imageFiles.length === 0
){

alert(
"Please fill all fields"
);

uploadBtn.innerText =
"Upload Property";

return;

}


// UPLOAD IMAGES
const imageUrls = [];

for(
let i = 0;
i < imageFiles.length;
i++
){

const formData =
new FormData();

formData.append(
"file",
imageFiles[i]
);

formData.append(
"upload_preset",
UPLOAD_PRESET
);

const response =
await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
{
method:"POST",
body:formData
}
);

const data =
await response.json();

imageUrls.push(
data.secure_url
);

}


// SAVE TO FIRESTORE
await addDoc(
collection(
db,
"properties"
),
{

title,
location,
price,
bedrooms,
bathrooms,
size,
status,
description,

images:
imageUrls,

createdAt:
serverTimestamp()

}
);


alert(
"Property uploaded successfully!"
);


// RESET FORM
document.getElementById(
"title"
).value = "";

document.getElementById(
"location"
).value = "";

document.getElementById(
"price"
).value = "";

document.getElementById(
"bedrooms"
).value = "";

document.getElementById(
"bathrooms"
).value = "";

document.getElementById(
"size"
).value = "";

document.getElementById(
"description"
).value = "";

document.getElementById(
"images"
).value = "";


uploadBtn.innerText =
"Upload Property";

loadProperties();

}
);
```
