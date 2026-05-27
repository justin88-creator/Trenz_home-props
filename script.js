const properties = [
  {
    title: "Serenity Ridge Villa",
    location: "Enugu, Nigeria",
    price: "₦55,000,000",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    bedrooms: 3,
    bathrooms: 2,
    size: "2100 sqft",
    status: "For Sale"
  },

  {
    title: "Luxury Duplex",
    location: "Lagos, Nigeria",
    price: "₦75,000,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    bedrooms: 5,
    bathrooms: 4,
    size: "3000 sqft",
    status: "For Sale"
  },

  {
    title: "Modern Mansion",
    location: "Abuja, Nigeria",
    price: "₦300,000,000",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800",
    bedrooms: 6,
    bathrooms: 5,
    size: "4500 sqft",
    status: "For Sale"
  }
];

const propertyGrid =
document.getElementById("propertyGrid");

function displayProperties() {

  propertyGrid.innerHTML = "";

  properties.forEach(property => {

    propertyGrid.innerHTML += `
    
      <div class="card">

        <img src="${property.image}"
        alt="${property.title}">

        <div class="card-content">

          <span class="badge">
            ${property.status}
          </span>

          <h3>${property.title}</h3>

          <p class="location">
            <i class="fa-solid fa-location-dot"></i>
            ${property.location}
          </p>

          <div class="details">
            <span>
              ${property.bedrooms} Bed
            </span>

            <span>
              ${property.bathrooms} Bath
            </span>

            <span>
              ${property.size}
            </span>
          </div>

          <div class="card-footer">

            <h4>${property.price}</h4>

            <button class="details-btn">
              View Details
            </button>

          </div>

        </div>

      </div>
    
    `;
  });
}

displayProperties();