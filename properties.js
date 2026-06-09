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

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const propertyGrid = document.getElementById("propertyGrid");
const paginationNumbers = document.getElementById("paginationNumbers");

let currentPage = 1;
const cardsPerPage = 12;
let allProperties = [];

// LOAD FIREBASE PROPERTIES
async function loadProperties() {
  try {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    allProperties = [];
    snapshot.forEach(doc => {
      allProperties.push({
        id: doc.id,
        ...doc.data()
      });
    });

    displayPage();
  } catch (error) {
    console.error("Error loading properties:", error);
  }
}

loadProperties();

// DISPLAY PAGE
function displayPage() {
  propertyGrid.innerHTML = "";

  const start = (currentPage - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginated = allProperties.slice(start, end);

  paginated.forEach(property => {
    propertyGrid.innerHTML += `
      <div class="card">
        <img src="${property.images[0]}" alt="${property.title}">
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
            <h4>${property.price}</h4>
            <a href="property.html?id=${property.id}">
              <button class="details-btn">View Details</button>
            </a>
          </div>
        </div>
      </div>
    `;
  });

  updatePagination();
}

// PAGINATION
function updatePagination() {
  paginationNumbers.innerHTML = "";

  const totalPages = Math.ceil(allProperties.length / cardsPerPage);

  // PREVIOUS BUTTON
  document.getElementById("prevBtn").disabled = currentPage === 1;

  // PAGE NUMBERS
  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.innerHTML += `
      <button
        class="page-number ${i === currentPage ? "active-page" : ""}"
        onclick="goToPage(${i})"
      >
        ${i}
      </button>
    `;
  }

  // NEXT BUTTON
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// GO TO PAGE
window.goToPage = function (page) {
  currentPage = page;
  displayPage();
};

// NEXT
document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(allProperties.length / cardsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage();
  }
});

// PREVIOUS
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayPage();
  }
});
