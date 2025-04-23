let map, autocomplete;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.8503, lng: 4.3517 },
    zoom: 10,
    minZoom: 2,
    restriction: {
      latLngBounds: { north: 85, south: -85, west: -179.999, east: 179.999 },
      strictBounds: false
    }
  });

  // Initialize Places Autocomplete
  const input = document.getElementById("autocomplete");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    document.getElementById("lat").value = place.geometry.location.lat();
    document.getElementById("lng").value = place.geometry.location.lng();
  });

  // Load saved spots
  const spots = JSON.parse(localStorage.getItem("spots")) || [];
  spots.forEach(addMarker);
}

function addMarker({ name, description, lat, lng }) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map,
    title: name
  });
  const info = new google.maps.InfoWindow({
    content: `<strong>${name}</strong><br>${description}`
  });
  marker.addListener("click", () => info.open(map, marker));
}

// DOM interactions
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBtn").addEventListener("click", () => {
    document.getElementById("formContainer").classList.toggle("show");
  });

  document.getElementById("submitBtn").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const desc = document.getElementById("description").value.trim();
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const msg = document.getElementById("formMsg");
    if (!name || !desc || isNaN(lat) || isNaN(lng)) {
      msg.textContent = "❗ Vul alle velden in en kies een geldige locatie.";
      return;
    }
    const spots = JSON.parse(localStorage.getItem("spots")) || [];
    spots.push({ name, description: desc, lat, lng });
    localStorage.setItem("spots", JSON.stringify(spots));
    addMarker({ name, description: desc, lat, lng });
    msg.textContent = "✅ Spot toegevoegd!";
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("autocomplete").value = "";
  });
});