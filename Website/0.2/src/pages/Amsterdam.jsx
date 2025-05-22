import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import "../css/AmsterdamPage.css"; // Use your styled dashboard CSS

const csvUrl = "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/master/Dataset/Processed-Dataset/amsterdam_weekends.csv";

// Minimal example districts (expand as needed)
const amsterdamDistricts = [
  {
    type: "Feature",
    properties: {
      name: "Amsterdam-Centrum",
      zone: "Zone 1",
      color: "#FF0000",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [4.895168, 52.370216],
          [4.895168, 52.380216],
          [4.905168, 52.380216],
          [4.905168, 52.370216],
          [4.895168, 52.370216],
        ],
      ],
    },
  },
  // Add more districts as needed
];

const Amsterdam = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setLocations(result.data);
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

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
      {/* Header Storytelling Section */}
      <section className="dashboard-header-card">
        <h1>Amsterdam Airbnb Data Story</h1>
        <p className="dashboard-narrative">
          Explore how Airbnb listings are distributed across Amsterdam’s districts.<br />
          Discover which zones lead in listings, compare price/rating, and interact with the map and charts to reveal trends.
        </p>
      </section>

      {/* Map Section */}
      <div className="amsterdam-main-row">
        <div className="amsterdam-map-card">
          <h3 className="section-title">Amsterdam Districts Map</h3>
          <MapContainer center={[52.370216, 4.895168]} zoom={13} style={{ height: "420px", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <GeoJSON
              data={amsterdamDistricts}
              style={districtStyle}
              onEachFeature={onEachDistrict}
            />
            {locations
              .filter((location) => {
                // Ensure lat and lng are valid numbers
                const lat = parseFloat(location.lat);
                const lng = parseFloat(location.lng);
                return !isNaN(lat) && !isNaN(lng);
              })
              .map((location, index) => {
                const lat = parseFloat(location.lat);
                const lng = parseFloat(location.lng);

                return (
                  <Marker
                    key={index}
                    position={[lat, lng]}
                    icon={new L.Icon({
                      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })}
                  >
                    <Popup>
                      <div>
                        <h3>{location.district}</h3>
                        <p><b>Price:</b> €{parseFloat(location.realSum).toFixed(2)}</p>
                        <p><b>Rating:</b> {location.guest_satisfaction_overall}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
          <p className="map-caption">
            <span role="img" aria-label="info">ℹ️</span> Click zones or markers for details.
          </p>
        </div>
      </div>
      {/* You can add further visualizations/cards here (charts, treemaps, etc) */}
    </div>
  );
};

export default Amsterdam;
