import React from "react";
import { useLocation } from "react-router-dom";
import "../css/CityNavigation.css";

const cities = [
  { name: "Amsterdam", path: "/eurobnb-insights/amsterdam", icon: "🌷" },
  { name: "Paris", path: "/paris", icon: "🗼" },
  { name: "Athens", path: "/eurobnb-insights/athens", icon: "🏛️" },
  // Add more cities here!
];

export default function CityNavigation() {
  const location = useLocation();

  return (
    <nav className="city-nav">
      <h2>Cities</h2>
      {cities.map(city => {
        const isActive = location.pathname.toLowerCase().includes(city.name.toLowerCase());
        return (
          <a
            key={city.name}
            className={`city-button${isActive ? " active" : ""}`}
            href={city.path}
          >
            <span className="city-icon">{city.icon}</span>
            {city.name}
          </a>
        );
      })}
    </nav>
  );
}
