const propertyGrid =
document.getElementById(
"propertyGrid"
);

const locationSelect =
document.getElementById(
"locationSelect"
);

let allProperties = [];


// FETCH PROPERTIES
fetch("data/properties.json")
.then(response =>
response.json()
)

.then(data => {

allProperties =
data.properties;


// AUTO LOCATION DROPDOWN
loadLocations();


// Show newest 6
const latestProperties =
[...allProperties]
.reverse()
.slice(0, 6);

displayProperties(
latestProperties
);

})

.catch(error => {

console.error(
"Error loading properties:",
error
);

});


// LOAD LOCATIONS
function loadLocations(){

// Get unique locations
const locations =
[
...new Set(
allProperties.map(
property =>
property.location
)
)
];

// Add locations
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

const realIndex =
allProperties.indexOf(
property
);

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

<a href="property.html?id=${realIndex}">
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

displayProperties(
[...filtered]
.reverse()
);

});