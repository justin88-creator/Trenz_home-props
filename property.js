const params =
new URLSearchParams(
window.location.search
);

const propertyId =
params.get("id");

let currentImage = 0;
let propertyImages = [];

fetch("data/properties.json")
.then(response =>
response.json()
)

.then(data => {

const property =
data.properties[propertyId];

// Safety check
if(!property){
  document.body.innerHTML =
  "<h1>Property not found</h1>";
  return;
}

// Multiple images
propertyImages =
property.images || [];

// Show first image
document.getElementById(
"propertyImage"
).src =
propertyImages[0];

// Property details
document.getElementById(
"propertyTitle"
).innerText =
property.title;

document.getElementById(
"propertyLocation"
).innerText =
"📍 " +
property.location;

document.getElementById(
"propertyPrice"
).innerText =
property.price;

document.getElementById(
"propertyBeds"
).innerText =
"🛏 " +
property.bedrooms +
" Bedrooms";

document.getElementById(
"propertyBaths"
).innerText =
"🛁 " +
property.bathrooms +
" Bathrooms";

document.getElementById(
"propertySize"
).innerText =
"📐 " +
property.size;

document.getElementById(
"propertyDescription"
).innerText =
property.description;

document.getElementById(
"propertyStatus"
).innerText =
property.status;

// Pay button
document.getElementById(
"payBtn"
).onclick =
() => {

payInspection(
property.title,
property.inspectionFee
);

};

})

.catch(error => {

console.error(
"Error loading property:",
error
);

});


// NEXT IMAGE
function nextImage(){

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
propertyImages[
currentImage
];

}


// PREVIOUS IMAGE
function prevImage(){

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
propertyImages[
currentImage
];

}


// PAYSTACK PAYMENT
function payInspection(
propertyName,
amount
){

const email =
prompt(
"Enter your email"
);

if(!email)
return;

let handler =
PaystackPop.setup({

key:
"pk_test_d45a93ab08c13a816151fa93b201a8af03294932",

email:
email,

amount:
amount * 100,

currency:
"NGN",

metadata:{
custom_fields:[
{
display_name:
"Property",

variable_name:
"property_name",

value:
propertyName
}
]
},

callback:
function(response){

alert(
`Payment successful for ${propertyName}

Reference:
${response.reference}`
);

// Replace with YOUR WhatsApp number
const whatsappNumber =
"2349027324048";

const message =
`Hi, I just paid for inspection of ${propertyName}.

Payment Reference:
${response.reference}`;

const whatsappURL =
`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

window.open(
whatsappURL,
"_blank"
);

},

onClose:
function(){

alert(
"Transaction cancelled"
);

}

});

handler.openIframe();

}