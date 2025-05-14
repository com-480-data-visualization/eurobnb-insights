import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const csvUrl = "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/master/Dataset/Processed-Dataset/amsterdam_weekends.csv";

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
    // Fetch and parse the CSV file
    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Parsed CSV data:", result.data);
            setLocations(result.data); // Store parsed data
          },
        });
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

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
  locations.forEach((location) => {
    console.log("Latitude:", location.lat);
    console.log("Longitude:", location.lng);
  });

  return (
    <div>
      <div style={{ display: "flex", height: "70vh", width: "100%" }}>
        {/* Map Container */}
        <div style={{ flex: 1 }}>
          <MapContainer center={[52.370216, 4.895168]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
/>
            <GeoJSON data={amsterdamDistricts} style={districtStyle} onEachFeature={onEachDistrict} />
            {locations
              .filter((location) => {
                // Ensure lat and lng are valid numbers
                const lat = parseFloat(location.lat);
                const lng = parseFloat(location.lng);
                return !isNaN(lat) && !isNaN(lng); // Skip if lat or lng is invalid
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
        </div>
      </div>
    </div>
  );
};

export default Amsterdam;