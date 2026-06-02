const propertyGrid =
document.getElementById(
"propertyGrid"
);

const paginationNumbers =
document.getElementById(
"paginationNumbers"
);

let currentPage = 1;

const cardsPerPage = 12;

let allProperties = [];
let originalProperties = [];

fetch(
"data/properties.json"
)
.then(response =>
response.json()
)

.then(data => {

originalProperties =
data.properties;

allProperties =
[...data.properties]
.reverse();

displayPage();

})

.catch(error => {

console.error(
"Error loading properties:",
error
);

});


function displayPage(){

propertyGrid.innerHTML =
"";

const start =
(currentPage - 1)
* cardsPerPage;

const end =
start + cardsPerPage;

const paginated =
allProperties.slice(
start,
end
);

paginated.forEach(
(property) => {

const realIndex =
originalProperties
.indexOf(property);

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

updatePagination();

}


function updatePagination(){

paginationNumbers.innerHTML =
"";

const totalPages =
Math.ceil(
allProperties.length /
cardsPerPage
);

// Previous button
document
.getElementById(
"prevBtn"
)
.disabled =
currentPage === 1;


// Number buttons
for(
let i = 1;
i <= totalPages;
i++
){

paginationNumbers.innerHTML += `
<button
class="page-number
${i === currentPage ? "active-page" : ""}"
onclick="goToPage(${i})">

${i}

</button>
`;

}


// Next button
document
.getElementById(
"nextBtn"
)
.disabled =
currentPage ===
totalPages;

}


function goToPage(
page
){

currentPage = page;

displayPage();

}


document
.getElementById(
"nextBtn"
)
.addEventListener(
"click",
() => {

const totalPages =
Math.ceil(
allProperties.length /
cardsPerPage
);

if(
currentPage <
totalPages
){
currentPage++;
displayPage();
}

});


document
.getElementById(
"prevBtn"
)
.addEventListener(
"click",
() => {

if(
currentPage > 1
){
currentPage--;
displayPage();
}

});