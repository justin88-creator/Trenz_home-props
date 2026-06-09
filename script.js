import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBd8tdjl7b8Pp65hsnlFtBmmKAPxnMRLM0",
  authDomain: "trenzorhomesadmin.firebaseapp.com",
  projectId: "trenzorhomesadmin",
  storageBucket: "trenzorhomesadmin.firebasestorage.app",
  messagingSenderId: "992246313430",
  appId: "1:992246313430:web:ea1390019bf9f8f7423477"
};

// INITIALIZE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const propertyGrid = document.getElementById("propertyGrid");
const locationSelect = document.getElementById("locationSelect");

// STORAGE
let allProperties = [];
const imageIndexes = {};

// LOAD PROPERTIES
async function loadProperties() {
  try {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    allProperties = [];
    snapshot.forEach(docSnap => {
      allProperties.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    // LOAD LOCATIONS
    loadLocations();

    // SHOW NEWEST 6
    displayProperties(allProperties.slice(0, 6));
  } catch (error) {
    console.error("Error loading properties:", error);
  }
}

loadProperties();

// LOAD LOCATIONS
function loadLocations() {
  const locations = [...new Set(allProperties.map(property => property.location))];

  locationSelect.innerHTML = `<option value="">All Locations</option>`;

  locations.forEach(location => {
    locationSelect.innerHTML += `
      <option value="${location.toLowerCase()}">${location}</option>
    `;
  });
}

// DISPLAY PROPERTIES
function displayProperties(properties) {
  propertyGrid.innerHTML = "";

  properties.forEach(property => {
    imageIndexes[property.id] = 0;

    propertyGrid.innerHTML += `
      <div class="card">
        <div class="card-slider">
          <button class="card-slider-btn prev" onclick="changeCardImage(event, '${property.id}', -1)">❮</button>
          <img
            class="card-image"
            id="cardImage-${property.id}"
            src="${property.images?.[0] || ''}"
            alt="${property.title}"
          >
          <button class="card-slider-btn next" onclick="changeCardImage(event, '${property.id}', 1)">❯</button>
          <div class="image-count" id="imageCount-${property.id}">1/${property.images?.length || 1}</div>
        </div>

        <div class="card-content">
          <span class="badge">${property.status}</span>
          <h3>${property.title}</h3>
          <p class="location">📍 ${property.location}</p>

          <div class="details">
            <span>🛏 ${property.bedrooms} Beds</span>
            <span>🛁 ${property.bathrooms} Baths</span>
            <span>📐 ${property.size}</span>
          </div>

          <p>${property.description}</p>

          <div class="card-footer">
            <h4>₦${Number(property.price).toLocaleString()}</h4>
            <a href="property.html?id=${property.id}">
              <button class="details-btn">View Details</button>
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

// IMAGE PAGINATION
window.changeCardImage = function (event, propertyId, direction) {
  event.preventDefault();
  event.stopPropagation();

  const property = allProperties.find(p => p.id === propertyId);
  if (!property || !property.images || property.images.length === 0) {
    return;
  }

  imageIndexes[propertyId] += direction;

  // LOOP
  if (imageIndexes[propertyId] >= property.images.length) {
    imageIndexes[propertyId] = 0;
  }

  if (imageIndexes[propertyId] < 0) {
    imageIndexes[propertyId] = property.images.length - 1;
  }

  // CHANGE IMAGE
  document.getElementById(`cardImage-${propertyId}`).src = property.images[imageIndexes[propertyId]];

  // UPDATE COUNTER
  document.getElementById(`imageCount-${propertyId}`).innerText =
    `${imageIndexes[propertyId] + 1}/${property.images.length}`;
};

// SEARCH FILTER
document.getElementById("searchBtn").addEventListener("click", function () {
  const location = document.getElementById("locationSelect").value.toLowerCase();
  const status = document.getElementById("statusSelect").value.toLowerCase();
  const bedrooms = document.getElementById("bedroomSelect").value;

  // FILTER
  const filtered = allProperties.filter(property => {
    const matchLocation = !location || property.location.toLowerCase().includes(location);
    const matchStatus = !status || property.status.toLowerCase() === status;
    const matchBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms);

    return matchLocation && matchStatus && matchBedrooms;
  });

  displayProperties(filtered.slice(0, 6));
});

const menuToggle = document.querySelector('.menu-toggle');
const navGroup = document.querySelector('.nav-group');
const navLinks = document.querySelectorAll('.nav-links a');

if (menuToggle && navGroup) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navGroup.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navGroup.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar') && navGroup.classList.contains('open')) {
      navGroup.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

