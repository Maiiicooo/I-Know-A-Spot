// main.js

// 1) Hier zet je alle door jou goedgekeurde spots (met manual address)
const approvedSpots = [
  {
    name: 'Grote Markt Brussel',
    description: 'Prachtige historische spot in hartje Brussel.',
    lat: 50.8466,
    lng: 4.3528,
    photo: 'https://www.27vakantiedagen.nl/wp-content/uploads/2021/01/belgie-brussel-grote-markt.jpg',
    address: 'Grote Markt 1, 1000 Brussel, België'
  },
  {
    name: 'Citadelpark Gent',
    description: 'Rustige plek bij het water en veel groen.',
    lat: 51.0520,
    lng: 3.7174,
    photo: 'https://link-naar-foto-2.jpg',
    address: 'Citadelpark, 9000 Gent, België'
  }
  // … voeg hier je volgende goedgekeurde spots toe …
];

let map, autocomplete, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.8503, lng: 4.3517 },
    zoom: 10,
    minZoom: 2
  });

  infoWindow = new google.maps.InfoWindow();

  // Sluit de infowindow bij een klik op de kaart
  map.addListener("click", () => {
    infoWindow.close();
  });

  // Voeg alleen je manueel goedgekeurde spots toe
  approvedSpots.forEach(addMarker);

  // Autocomplete setup voor het formulier (Formspree)
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete")
  );
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    document.getElementById("lat").value = place.geometry.location.lat();
    document.getElementById("lng").value = place.geometry.location.lng();
  });
}

function addMarker(spot) {
  const marker = new google.maps.Marker({
    position: { lat: spot.lat, lng: spot.lng },
    map,
    title: spot.name
  });

  marker.addListener("click", () => {
    // Bouw custom InfoWindow-content
    let content = `<div class="info-window">`;
    if (spot.photo) {
      content += `
        <a href="${spot.photo}" target="_blank" rel="noopener">
          <img src="${spot.photo}" class="info-img" alt="${spot.name}">
        </a>
      `;
    }
    content += `<h3>${spot.name}</h3>`;
    content += `<p>${spot.description}</p>`;

    if (spot.address) {
      // Link opent navigatie naar lat,lng in Google Maps
      const navUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
      content += `
        <p class="address">
          <a href="${navUrl}" target="_blank" rel="noopener">
            ${spot.address}
          </a>
        </p>
      `;
    }

    content += `</div>`;

    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // Form toggle logic
  const addBtn       = document.getElementById("addBtn");
  const formContainer= document.getElementById("formContainer");
  const closeForm    = document.getElementById("closeForm");

  addBtn.addEventListener("click", () => {
    formContainer.style.display = "block";
  });
  closeForm.addEventListener("click", () => {
    formContainer.style.display = "none";
  });
});
