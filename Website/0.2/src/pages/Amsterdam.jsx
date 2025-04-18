import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Treemap, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  // Style each district based on its color property
  const districtStyle = (feature) => ({
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
    <div>
      {/* Map Section */}
      <div style={{ display: "flex", height: "70vh", width: "100%" }}>
        {/* Sidebar Menu */}
        <div style={{ width: "250px", padding: "20px", backgroundColor: "#f4f4f4", borderRight: "1px solid #ddd" }}>
          <h3>Filter Options</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <label>
                <input type="checkbox" /> Centrum
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> West Zone
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> East Zone
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> Oost
              </label>
            </li>
          </ul>
          <button style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Apply Filters
          </button>
        </div>

        {/* Map Container */}
        <div style={{ flex: 1 }}>
          <MapContainer center={[52.370216, 4.895168]} zoom={13} style={{ height: "100%", width: "100%" }}>
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
        </div>
      </div>

      {/* Visualization Section */}
      <div style={{ padding: "20px" }}>
        <h3>Treemap Visualization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={treemapData}
            dataKey="size"
            stroke="#fff"
            fill="#8884d8"
            aspectRatio={4 / 3}
          />
        </ResponsiveContainer>

        <h3 style={{ marginTop: "40px" }}>Bar Graph Visualization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="listings" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Amsterdam;