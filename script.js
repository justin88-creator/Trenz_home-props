const propertyGrid =
document.getElementById("propertyGrid");

async function loadProperties() {

  const response =
  await fetch("data/properties.json");

  const data =
  await response.json();

  propertyGrid.innerHTML = "";

  data.properties.forEach(property => {

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
            📍 ${property.location}
          </p>

          <div class="details">
            <span>${property.bedrooms} Bed</span>
            <span>${property.bathrooms} Bath</span>
            <span>${property.size}</span>
          </div>

          <p>
            ${property.description}
          </p>

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

loadProperties();