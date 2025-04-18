// Initialize Leaflet map
const map = L.map('map').setView([48.8566, 2.3522], 12); // Default to Paris

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Placeholder marker
L.marker([48.8566, 2.3522]).addTo(map).bindPopup("Sample Airbnb in Paris");

// Wait for DOM to load before plotting
document.addEventListener("DOMContentLoaded", () => {
  renderPriceChart();
});

function renderPriceChart() {
  const priceData = [50, 70, 90, 120, 150, 200]; // Mock data

  try {
    Plotly.newPlot('chart', [{
      x: priceData,
      type: 'histogram',
      marker: { color: '#3498db' }
    }], {
      title: 'Price Distribution (Mock Data)',
      xaxis: { title: 'Price (€)' },
      yaxis: { title: 'Number of Listings' },
      bargap: 0.05
    });
    console.log("Plotly chart rendered successfully.");
  } catch (err) {
    console.warn("Plotly chart rendering failed:", err);
  }
}
