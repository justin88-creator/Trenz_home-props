import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
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


// INITIALIZE FIREBASE
const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);


// DOM
const propertyGrid =
document.getElementById(
"propertyGrid"
);

const locationSelect =
document.getElementById(
"locationSelect"
);

let allProperties = [];


// FETCH FIREBASE PROPERTIES
async function loadProperties(){

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

allProperties = [];

snapshot.forEach(doc => {

allProperties.push({

id: doc.id,
...doc.data()

});

});


// AUTO LOCATION DROPDOWN
loadLocations();


// SHOW NEWEST 6
const latestProperties =
allProperties.slice(0, 6);

displayProperties(
latestProperties
);

}catch(error){

console.error(
"Error loading properties:",
error
);

}

}

loadProperties();


// LOAD LOCATIONS
function loadLocations(){

locationSelect.innerHTML = `
<option value="">
All Locations
</option>
`;


// UNIQUE LOCATIONS
const locations =
[
...new Set(
allProperties.map(
property =>
property.location
)
)
];


locations.forEach(
location => {

locationSelect.innerHTML += `
<option value="${location.toLowerCase()}">
${location}
</option>
`;

});

}


// DISPLAY PROPERTIES
function displayProperties(
properties
){

propertyGrid.innerHTML =
"";


properties.forEach(
(property) => {

propertyGrid.innerHTML += `

<div class="card">

<img
src="${property.images[0]}"
alt="${property.title}">

<div class="card-content">

<span class="badge">
${property.status}
</span>

<h3>
${property.title}
</h3>

<p class="location">
📍 ${property.location}
</p>

<div class="details">

<span>
🛏 ${property.bedrooms}
Beds
</span>

<span>
🛁 ${property.bathrooms}
Baths
</span>

<span>
📐 ${property.size}
</span>

</div>

<p>
${property.description}
</p>

<div class="card-footer">

<h4>
${property.price}
</h4>

<a href="property.html?id=${property.id}">

<button class="details-btn">
View Details
</button>

</a>

</div>

</div>

</div>

`;

});

}


// SEARCH BUTTON
document
.getElementById(
"searchBtn"
)
.addEventListener(
"click",
function(){

const location =
document
.getElementById(
"locationSelect"
)
.value
.toLowerCase();

const status =
document
.getElementById(
"statusSelect"
)
.value
.toLowerCase();

const bedrooms =
document
.getElementById(
"bedroomSelect"
)
.value;


// FILTER
const filtered =
allProperties.filter(
property => {

const matchLocation =
!location ||
property.location
.toLowerCase()
.includes(location);

const matchStatus =
!status ||
property.status
.toLowerCase() ===
status;

const matchBedrooms =
!bedrooms ||
property.bedrooms >=
parseInt(bedrooms);

return (
matchLocation &&
matchStatus &&
matchBedrooms
);

});


// SHOW FILTERED
displayProperties(
filtered
);

});

