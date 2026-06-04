import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
collection,
getDocs,
addDoc
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


// INITIALIZE FIREBASE
const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);


// URL PARAMS
const params =
new URLSearchParams(
window.location.search
);

const propertyId =
params.get("id");

let propertyData = {};
let currentImage = 0;
let propertyImages = [];


// LOAD PROPERTY FROM FIREBASE
async function loadProperty(){

try{

const propertyRef =
doc(
db,
"properties",
propertyId
);

const propertySnap =
await getDoc(
propertyRef
);

if(
!propertySnap.exists()
){

document.body.innerHTML =
"<h2>Property not found</h2>";

return;

}

propertyData =
propertySnap.data();

propertyImages =
propertyData.images || [];


// MAIN IMAGE
document.getElementById(
"propertyImage"
).src =
propertyImages[0];


// DETAILS
document.getElementById(
"propertyTitle"
).innerText =
propertyData.title;

document.getElementById(
"propertyLocation"
).innerText =
"📍 " +
propertyData.location;

document.getElementById(
"propertyPrice"
).innerText =
propertyData.price;

document.getElementById(
"propertyBeds"
).innerText =
"🛏 " +
propertyData.bedrooms +
" Bedrooms";

document.getElementById(
"propertyBaths"
).innerText =
"🛁 " +
propertyData.bathrooms +
" Bathrooms";

document.getElementById(
"propertySize"
).innerText =
"📐 " +
propertyData.size;

document.getElementById(
"propertyDescription"
).innerText =
propertyData.description;

document.getElementById(
"propertyStatus"
).innerText =
propertyData.status;


// BOOK BUTTON
document.getElementById(
"bookBtn"
).onclick =
openBooking;

}catch(error){

console.error(error);

}

}

loadProperty();


// IMAGE NEXT
window.nextImage =
function(){

currentImage++;

if(
currentImage >=
propertyImages.length
){
currentImage = 0;
}

document.getElementById(
"propertyImage"
).src =
propertyImages[currentImage];

};


// IMAGE PREV
window.prevImage =
function(){

currentImage--;

if(
currentImage < 0
){
currentImage =
propertyImages.length - 1;
}

document.getElementById(
"propertyImage"
).src =
propertyImages[currentImage];

};


// OPEN MODAL
window.openBooking =
function(){

document.getElementById(
"bookingModal"
).style.display =
"flex";

};


// CLOSE MODAL
window.closeBooking =
function(){

document.getElementById(
"bookingModal"
).style.display =
"none";

};


// SUBMIT BOOKING
window.submitBooking =
async function(){

const name =
document.getElementById(
"customerName"
).value;

const phone =
document.getElementById(
"customerPhone"
).value;

const time =
document.getElementById(
"bookingTime"
).value;


if(
!name ||
!phone ||
!time
){

alert(
"Please complete all fields"
);

return;

}


// CHECK SATURDAY BOOKINGS
const snapshot =
await getDocs(
collection(
db,
"bookings"
)
);

const saturdayBookings =
snapshot.docs.length;


if(
saturdayBookings >= 10
){

alert(
"Saturday is fully booked.\n\nContact 2348058179847"
);

return;

}


// GENERATE REFERENCE
const reference =
"TRZ-" +
Math.floor(
10000 +
Math.random() *
90000
);


// SAVE BOOKING
await addDoc(
collection(
db,
"bookings"
),
{

reference,

property:
propertyData.title,

name,
phone,
time,

date:
"Saturday"

}
);


// WHATSAPP MESSAGE
const message =
`🏠 Property Inspection Booking

Reference:
${reference}

Property:
${propertyData.title}

Name:
${name}

Phone:
${phone}

Date:
Saturday

Time:
${time}

Can't make Saturday?
Contact:
2348058179847`;


window.open(
`https://wa.me/2349027324048?text=${encodeURIComponent(message)}`,
"_blank"
);


alert(
`Booking successful!

Reference:
${reference}`
);

closeBooking();

};
