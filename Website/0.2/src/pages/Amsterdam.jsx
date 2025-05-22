import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Treemap, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../css/AmsterdamPage.css";

// GeoJSON data for Amsterdam districts with zones
const amsterdamDistricts = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Centrum", zone: "Centrum", color: "#FF5733" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [4.891, 52.372],
            [4.895, 52.373],
            [4.899, 52.372],
            [4.891, 52.372],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "West Zone", zone: "West", color: "#33FF57" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [4.880, 52.370],
            [4.885, 52.371],
            [4.890, 52.370],
            [4.880, 52.370],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "East Zone", zone: "East", color: "#3357FF" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [4.900, 52.370],
            [4.905, 52.371],
            [4.910, 52.370],
            [4.900, 52.370],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Oost", zone: "Oost", color: "#FF33A1" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [4.910, 52.368],
            [4.915, 52.369],
            [4.920, 52.368],
            [4.910, 52.368],
          ],
        ],
      },
    },
  ],
};

// Random marker coordinates with Airbnb data
const randomMarker = {
  position: [52.370216, 4.895168],
  description: {
    title: "Cozy Apartment in Centrum",
    price: "€120/night",
    rating: "4.8/5",
    reviews: 34,
  },
};

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Sample data for treemap and bar graph
const treemapData = [
  { name: "Centrum", size: 400 },
  { name: "West Zone", size: 300 },
  { name: "East Zone", size: 200 },
  { name: "Oost", size: 100 },
];

const barGraphData = [
  { name: "Centrum", listings: 120 },
  { name: "West Zone", listings: 80 },
  { name: "East Zone", listings: 60 },
  { name: "Oost", listings: 40 },
];


const Amsterdam = () => {
  const districtStyle = feature => ({
    fillColor: feature.properties.color,
    weight: 2,
    opacity: 1,
    color: "black",
    fillOpacity: 0.6,
  });

  const onEachDistrict = (district, layer) => {
    const { name, zone } = district.properties;
    layer.bindPopup(`<b>${name}</b><br>Zone: ${zone}`);
  };

  return (
    <div className="amsterdam-dashboard-page">
      {/* ====== HEADER STORYTELLING SECTION ====== */}
      <section className="dashboard-header-card">
        <h1>Amsterdam Airbnb Data Story</h1>
        <p className="dashboard-narrative">
          Explore how Airbnb listings are distributed across Amsterdam’s districts.  
          Discover which zones lead in listings, compare price/rating, and interact with the map and charts to reveal trends.
        </p>
      </section>

      {/* ====== MAP & FILTER SIDEBAR ====== */}
      <div className="amsterdam-main-row">
        <aside className="amsterdam-sidebar">
          <h3>Filter Options</h3>
          <ul>
            <li><label><input type="checkbox" /> Centrum</label></li>
            <li><label><input type="checkbox" /> West Zone</label></li>
            <li><label><input type="checkbox" /> East Zone</label></li>
            <li><label><input type="checkbox" /> Oost</label></li>
          </ul>
          <button className="filter-btn">Apply Filters</button>
        </aside>
        <div className="amsterdam-map-card">
          <h3 className="section-title">Amsterdam Districts Map</h3>
          <MapContainer center={[52.370216, 4.895168]} zoom={13} style={{ height: "410px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON data={amsterdamDistricts} style={districtStyle} onEachFeature={onEachDistrict} />
            <Marker position={randomMarker.position} icon={customIcon}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <h3>{randomMarker.description.title}</h3>
                  <p><b>Price:</b> {randomMarker.description.price}</p>
                  <p><b>Rating:</b> {randomMarker.description.rating}</p>
                  <p><b>Reviews:</b> {randomMarker.description.reviews} reviews</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
          <p className="map-caption">
            <span role="img" aria-label="info">ℹ️</span> Click zones or markers for details.
          </p>
        </div>
      </div>

      {/* ====== VISUALIZATIONS SECTION ====== */}
      <div className="amsterdam-visuals-row">
        <div className="visual-card">
          <h3 className="section-title">Treemap: Listings Proportion by Zone</h3>
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              aspectRatio={4 / 3}
            />
          </ResponsiveContainer>
          <div className="viz-caption">
            Centrum has the highest share of listings. Hover for zone sizes.
          </div>
        </div>
        <div className="visual-card">
          <h3 className="section-title">Bar Chart: Listings Count per Zone</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barGraphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="listings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="viz-caption">
            Centrum leads, followed by the West Zone. 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amsterdam;