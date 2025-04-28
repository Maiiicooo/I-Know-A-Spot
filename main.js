// main.js

const approvedSpots = [
  {
    name: 'Grote Markt Brussel',
    description: 'Prachtige historische spot in hartje Brussel.',
    lat: 50.8466, lng: 4.3528,
    photo: 'https://www.27vakantiedagen.nl/wp-content/uploads/2021/01/belgie-brussel-grote-markt.jpg',
    address: 'Grote Markt 1, 1000 Brussel, België'
  },
  {
    name: 'Citadelpark Gent',
    description: 'Rustige plek bij het water en veel groen.',
    lat: 51.0520, lng: 3.7174,
    photo: 'https://link-naar-foto-2.jpg',
    address: 'Citadelpark, 9000 Gent, België'
  }
];

let map, autocomplete, infoWindow, markersList = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.8503, lng: 4.3517 },
    zoom: 10, minZoom: 2
  });
  infoWindow = new google.maps.InfoWindow();
  map.addListener("click", () => infoWindow.close());

  approvedSpots.forEach(spot => {
    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map, title: spot.name
    });
    markersList.push({ marker, spot });
    marker.addListener("click", () => showInfo(marker, spot));
  });

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

  const searchInput   = document.getElementById("searchInput");
  const suggestionsEl = document.getElementById("suggestions");

  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase().trim();
    markersList.forEach(({ marker, spot }) => {
      const hay = (spot.name + ' ' + spot.description + ' ' + spot.address).toLowerCase();
      marker.setMap(!term || hay.includes(term) ? map : null);
    });
    const matches = approvedSpots
      .map(s => s.name)
      .filter(n => n.toLowerCase().includes(term));
    if (term && matches.length) {
      suggestionsEl.innerHTML = matches.slice(0,10)
        .map(n => `<div class="suggestion-item">${n}</div>`).join('');
      suggestionsEl.classList.remove('hidden');
    } else {
      suggestionsEl.classList.add('hidden');
    }
  });

  suggestionsEl.addEventListener("click", e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const val = item.textContent;
    searchInput.value = val;
    suggestionsEl.classList.add('hidden');
    const term = val.toLowerCase().trim();
    markersList.forEach(({ marker, spot }) => {
      const hay = (spot.name + ' ' + spot.description + ' ' + spot.address).toLowerCase();
      marker.setMap(!term || hay.includes(term) ? map : null);
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest('.search-container'))
      suggestionsEl.classList.add('hidden');
  });
}

function showInfo(marker, spot) {
  let content = '<div class="info-window">';
  if (spot.photo) {
    content += `
      <a href="${spot.photo}" target="_blank" rel="noopener">
        <img src="${spot.photo}" class="info-img" alt="${spot.name}">
      </a>`;
  }
  content += `<h3>${spot.name}</h3><p>${spot.description}</p>`;
  if (spot.address) {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    content += `<p class="address"><a href="${navUrl}" target="_blank" rel="noopener">${spot.address}</a></p>`;
  }
  content += '</div>';
  infoWindow.setContent(content);
  infoWindow.open(map, marker);
}

window.addEventListener("DOMContentLoaded", () => {
  // Spot-form toggling
  document.getElementById("addBtn").addEventListener("click", () => {
    document.getElementById("formContainer").style.display = "block";
  });
  document.getElementById("closeForm").addEventListener("click", () => {
    document.getElementById("formContainer").style.display = "none";
  });

  // About-overlay toggling
  document.getElementById("aboutBtn").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("aboutContainer").classList.remove("hidden");
    document.body.classList.add("about-active");
  });
  document.getElementById("backToMap").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("aboutContainer").classList.add("hidden");
    document.body.classList.remove("about-active");
  });
});
