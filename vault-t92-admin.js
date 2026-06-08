import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
getDoc,
updateDoc,
serverTimestamp,
query,
orderBy
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


// SECURITY LOCK
onAuthStateChanged(
auth,
(user) => {

if(!user){

window.location.href =
"controlRoom-x92.html";

}

}
);


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

const updateBtn =
document.getElementById(
"updateBtn"
);

const cancelEditBtn =
document.getElementById(
"cancelEditBtn"
);

const propertyList =
document.getElementById(
"propertyList"
);

const bookingList =
document.getElementById(
"bookingList"
);

const loadingOverlay =
document.getElementById(
"loadingOverlay"
);

const loadingText =
document.getElementById(
"loadingText"
);


// EDIT STATE
let editingId = null;

let existingImages = [];


// LOGOUT
document.getElementById(
"logoutBtn"
)
.addEventListener(
"click",
async () => {

try{

await signOut(auth);

window.location.href =
"controlRoom-x92.html";

}catch(error){

console.error(error);

alert(
"Logout failed"
);

}

}
);


// LOAD PROPERTIES
async function loadProperties(){

propertyList.innerHTML =
"Loading properties...";

try{

const q =
query(
collection(
db,
"properties"
),
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

propertyList.innerHTML =
"";

if(snapshot.empty){

propertyList.innerHTML =
"<p>No properties uploaded yet.</p>";

return;

}

snapshot.forEach(
(docSnap) => {

const property =
docSnap.data();

propertyList.innerHTML += `

<div class="property-item">

<div>

<h3>
${property.title}
</h3>

<p>
📍 ${property.location}
</p>

<p>
${property.price}
</p>

<p>
📸 ${property.images?.length || 0}
images
</p>

</div>

<div
style="
display:flex;
gap:10px;
">

<button
style="
background:black;
color:white;
padding:10px 15px;
border:none;
border-radius:8px;
cursor:pointer;"
onclick="editProperty('${docSnap.id}')">

Edit

</button>

<button
class="delete-btn"
onclick="deleteProperty('${docSnap.id}')">

Delete

</button>

</div>

</div>

`;

});

}catch(error){

console.error(error);

propertyList.innerHTML =
"Error loading properties.";

}

}

loadProperties();





// EDIT PROPERTY
window.editProperty =
async function(id){

try{

const propertyRef =
doc(
db,
"properties",
id
);

const propertySnap =
await getDoc(
propertyRef
);

if(
!propertySnap.exists()
){
return;
}

const property =
propertySnap.data();

editingId = id;

existingImages =
property.images || [];


// FILL FORM
document.getElementById(
"title"
).value =
property.title;

document.getElementById(
"location"
).value =
property.location;

document.getElementById(
"price"
).value =
property.price;

document.getElementById(
"bedrooms"
).value =
property.bedrooms;

document.getElementById(
"bathrooms"
).value =
property.bathrooms;

document.getElementById(
"size"
).value =
property.size;

document.getElementById(
"status"
).value =
property.status;

document.getElementById(
"description"
).value =
property.description;


// BUTTON SWITCH
uploadBtn.style.display =
"none";

updateBtn.style.display =
"block";

cancelEditBtn.style.display =
"block";


// SCROLL TOP
window.scrollTo({
top:0,
behavior:"smooth"
});

}catch(error){

console.error(error);

alert(
"Failed to load property"
);

}

};


// UPLOAD PROPERTY
uploadBtn.addEventListener(
"click",
async () => {

try{

loadingOverlay.style.display =
"flex";

loadingText.innerText =
"Uploading property...";

uploadBtn.disabled =
true;


// FORM VALUES
const title =
document.getElementById(
"title"
).value.trim();

const location =
document.getElementById(
"location"
).value.trim();

const price =
document.getElementById(
"price"
).value.trim();

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
).value.trim();

const status =
document.getElementById(
"status"
).value;

const description =
document.getElementById(
"description"
).value.trim();

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
"Please complete all fields and select images"
);

loadingOverlay.style.display =
"none";

uploadBtn.disabled =
false;

return;

}


// MULTIPLE IMAGE UPLOAD
const imageUrls = [];

for(
let i = 0;
i < imageFiles.length;
i++
){

loadingText.innerText =
`Uploading image ${i + 1} of ${imageFiles.length}`;

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


// SAVE PROPERTY
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

resetForm();

loadProperties();

}catch(error){

console.error(error);

alert(
"Upload failed"
);

}finally{

loadingOverlay.style.display =
"none";

uploadBtn.disabled =
false;

}

}
);


// UPDATE PROPERTY
updateBtn.addEventListener(
"click",
async () => {

try{

loadingOverlay.style.display =
"flex";

loadingText.innerText =
"Updating property...";

const imageFiles =
document.getElementById(
"images"
).files;

const newImages = [];


// UPLOAD NEW IMAGES
for(
let i = 0;
i < imageFiles.length;
i++
){

loadingText.innerText =
`Uploading image ${i + 1} of ${imageFiles.length}`;

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

newImages.push(
data.secure_url
);

}


// KEEP OLD + NEW IMAGES
const mergedImages =
[
...existingImages,
...newImages
];


// UPDATE FIRESTORE
await updateDoc(
doc(
db,
"properties",
editingId
),
{

title:
document.getElementById(
"title"
).value,

location:
document.getElementById(
"location"
).value,

price:
document.getElementById(
"price"
).value,

bedrooms:
parseInt(
document.getElementById(
"bedrooms"
).value
),

bathrooms:
parseInt(
document.getElementById(
"bathrooms"
).value
),

size:
document.getElementById(
"size"
).value,

status:
document.getElementById(
"status"
).value,

description:
document.getElementById(
"description"
).value,

images:
mergedImages

}
);

alert(
"Property updated!"
);

resetForm();

loadProperties();

}catch(error){

console.error(error);

alert(
"Update failed"
);

}finally{

loadingOverlay.style.display =
"none";

}

}
);


// DELETE PROPERTY
window.deleteProperty =
async function(id){

const confirmDelete =
confirm(
"Delete this property?"
);

if(!confirmDelete)
return;

try{

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

}catch(error){

console.error(error);

alert(
"Failed to delete property"
);

}

};



// CANCEL EDIT
cancelEditBtn.addEventListener(
"click",
resetForm
);


// RESET FORM
function resetForm(){

editingId = null;

existingImages = [];

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
"status"
).value =
"For Sale";

document.getElementById(
"description"
).value = "";

document.getElementById(
"images"
).value = "";


uploadBtn.style.display =
"block";

updateBtn.style.display =
"none";

cancelEditBtn.style.display =
"none";

loadingOverlay.style.display =
"none";

}


// LOAD BOOKINGS
async function loadBookings(){

bookingList.innerHTML =
"Loading bookings...";

try{

const snapshot =
await getDocs(
collection(
db,
"bookings"
)
);

bookingList.innerHTML =
"";

if(snapshot.empty){

bookingList.innerHTML =
"<p>No bookings yet.</p>";

return;

}

snapshot.forEach(
(docSnap) => {

const booking =
docSnap.data();

bookingList.innerHTML += `

<div class="booking-item">

<h4>
🏠 ${booking.property}
</h4>

<p>
👤 ${booking.name}
</p>

<p>
📞 ${booking.phone}
</p>

<p>
🕒 ${booking.time}
</p>

<p>
🔖 ${booking.reference}
</p>

<button
class="delete-booking-btn"
onclick="deleteBooking('${docSnap.id}')">

Delete Booking

</button>

</div>

`;

});

}catch(error){

console.error(error);

bookingList.innerHTML =
"Failed to load bookings.";

}

}

loadBookings();


// DELETE BOOKING
window.deleteBooking =
async function(id){

const confirmDelete =
confirm(
"Delete this booking?"
);

if(!confirmDelete)
return;

try{

await deleteDoc(
doc(
db,
"bookings",
id
)
);

alert(
"Booking deleted"
);

loadBookings();

}catch(error){

console.error(error);

alert(
"Failed to delete booking"
);

}

};

