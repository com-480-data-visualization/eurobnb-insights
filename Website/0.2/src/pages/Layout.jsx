import CircularProgress from "@mui/material/CircularProgress"; // Add this if using MUI, or use your own spinner
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import "../css/Tstyles.css";
import MapComponent from "./MapComponent";

const cityList = [
  {
    name: "Amsterdam",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/amsterdam_weekends.csv",
  },
  {
    name: "Athens",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/athens_weekends.csv",
  },
  {
    name: "Barcelona",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/barcelona_weekends.csv",
  },
  {
    name: "Berlin",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/berlin_weekends.csv",
  },
  {
    name: "Budapest",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/budapest_weekends.csv",
  },
  {
    name: "Lisbon",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/lisbon_weekends.csv",
  },
  {
    name: "London",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Reduced-Dataset/london_weekdays.csv",
  },
  {
    name: "Paris",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/paris_weekends.csv",
  },
  {
    name: "Rome",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/rome_weekends.csv",
  },
  {
    name: "Vienna",
    url: "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/vienna_weekends.csv",
  },
];

function useCityData(city) {
  const cacheRef = React.useRef({});
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!city) return;
    if (cacheRef.current[city.name]) {
      setData(cacheRef.current[city.name]);
      return;
    }
    setData(null); // Show loading state
    fetch(city.url)
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, dynamicTyping: true });
        cacheRef.current[city.name] = parsed.data;
        setData(parsed.data);
      });
  }, [city]);
  return data;
}

function aggregateStats(data) {
  // Simple mean aggregation for demonstration
  if (!data || data.length === 0) return null;
  const keys = [
    "cleanliness_rating",
    "guest_satisfaction_overall",
    "person_capacity",
    "bedrooms",
    "attr_index_norm",
    "rest_index_norm",
    "realSum", // Add realSum for average price
  ];
  const stats = {};
  keys.forEach((key) => {
    const vals = data.map((d) => Number(d[key])).filter((v) => !isNaN(v));
    // For price, round to 2 decimals, else nearest whole number
    stats[key] =
      key === "realSum"
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) /
          100
        : Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });
  return stats;
}

export default function Layout() {
  const [cityA, setCityA] = useState(cityList[0]);
  const [cityB, setCityB] = useState(cityList[1]);

  const dataA = useCityData(cityA);
  const dataB = useCityData(cityB);

  const statsA = aggregateStats(dataA);
  const statsB = aggregateStats(dataB);

  // Loading state for city data
  const loadingA = !dataA;
  const loadingB = !dataB;

  // Prepare data for Nivo Bar and Radar
  const chartKeys = [
    { key: "cleanliness_rating", label: "Cleanliness" },
    { key: "guest_satisfaction_overall", label: "Guest Satisfaction" },
    { key: "person_capacity", label: "Capacity" },
    { key: "bedrooms", label: "Bedrooms" },
    { key: "attr_index_norm", label: "Attraction Index" },
    { key: "rest_index_norm", label: "Restaurant Index" },
  ];

  const barData =
    statsA && statsB
      ? chartKeys.map((k) => ({
          stat: k.label,
          [cityA.name]: statsA[k.key],
          [cityB.name]: statsB[k.key],
        }))
      : [];

  const radarData =
    statsA && statsB
      ? chartKeys.map((k) => ({
          stat: k.label,
          [cityA.name]: statsA[k.key],
          [cityB.name]: statsB[k.key],
        }))
      : [];

  // Scatter plot: guest_satisfaction_overall vs cleanliness_rating
  const scatterData =
    dataA && dataB
      ? [
          {
            id: cityA.name,
            data: dataA
              .map((d) =>
                d.cleanliness_rating && d.guest_satisfaction_overall
                  ? {
                      x: d.cleanliness_rating,
                      y: d.guest_satisfaction_overall,
                    }
                  : null
              )
              .filter(Boolean),
          },
          {
            id: cityB.name,
            data: dataB
              .map((d) =>
                d.cleanliness_rating && d.guest_satisfaction_overall
                  ? {
                      x: d.cleanliness_rating,
                      y: d.guest_satisfaction_overall,
                    }
                  : null
              )
              .filter(Boolean),
          },
        ]
      : [];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Eurobnb Insights</h1>
      </header>

      <div className="app-content">
        <main className="main-area">
          <section className="map-wrapper">
            <MapComponent />
          </section>
        </main>
      </div>

      <section className="city-compare-controls">
        <label>
          <span style={{ color: "#e8c0a0", fontWeight: "bold" }}>City A:</span>
          &nbsp;
          <select
            value={cityA.name}
            onChange={(e) =>
              setCityA(cityList.find((c) => c.name === e.target.value))
            }
          >
            {cityList.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        &nbsp;&nbsp;
        <label>
          <span style={{ color: "#f5765f", fontWeight: "bold" }}>City B:</span>
          &nbsp;
          <select
            value={cityB.name}
            onChange={(e) =>
              setCityB(cityList.find((c) => c.name === e.target.value))
            }
          >
            {cityList.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* --- Key Insights Section --- */}
      {loadingA || loadingB ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        statsA &&
        statsB &&
        (cityA.name === cityB.name ? (
          <section
            className="city-key-insights"
            style={{
              margin: "2.5rem 0 2rem 0",
              display: "flex",
              gap: "3rem",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fff8f3 0%, #f8f8f8 100%)",
                padding: "2rem 3rem",
                borderRadius: "18px",
                minWidth: "320px",
                boxShadow: "0 4px 18px 0 rgba(245, 118, 95, 0.07)",
                border: `2px solid #e8c0a022`,
                textAlign: "center",
                fontSize: "1.15rem",
              }}
            >
              <span
                role="img"
                aria-label="facepalm"
                style={{
                  fontSize: "2.2rem",
                  marginBottom: 10,
                  display: "block",
                }}
              >
                🤦‍♂️
              </span>
              <strong>
                Key Insights are shy!
                <br />
                Please pick two different cities to see their unique stats.
              </strong>
            </div>
          </section>
        ) : (
          <section
            className="city-key-insights"
            style={{
              margin: "2.5rem 0 2rem 0",
              display: "flex",
              gap: "3rem",
              justifyContent: "center",
            }}
          >
            {[
              { city: cityA, stats: statsA, color: "#e8c0a0" },
              { city: cityB, stats: statsB, color: "#f5765f" },
            ].map(({ city, stats, color }) => (
              <div
                key={city.name}
                style={{
                  background:
                    "linear-gradient(135deg, #fff8f3 0%, #f8f8f8 100%)",
                  padding: "1.5rem 2.5rem",
                  borderRadius: "18px",
                  minWidth: "260px",
                  boxShadow: "0 4px 18px 0 rgba(245, 118, 95, 0.07)",
                  border: `2px solid ${color}22`,
                  transition: "transform 0.2s",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    color,
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    fontSize: "1.25rem",
                    marginBottom: "1.2rem",
                  }}
                >
                  {city.name} Key Insights
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="price"
                      style={{ marginRight: 6 }}
                    >
                      💶
                    </span>
                    <strong>Avg. Listing Price:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      €{stats.realSum}
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="clean"
                      style={{ marginRight: 6 }}
                    >
                      🧹
                    </span>
                    <strong>Avg. Cleanliness:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.cleanliness_rating}/10
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="satisfaction"
                      style={{ marginRight: 6 }}
                    >
                      😃
                    </span>
                    <strong>Avg. Guest Satisfaction:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.guest_satisfaction_overall}/100
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="capacity"
                      style={{ marginRight: 6 }}
                    >
                      🛏️
                    </span>
                    <strong>Avg. Capacity:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.person_capacity} guests
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="bedrooms"
                      style={{ marginRight: 6 }}
                    >
                      🛌
                    </span>
                    <strong>Avg. Bedrooms:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.bedrooms}
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="attraction"
                      style={{ marginRight: 6 }}
                    >
                      🗺️
                    </span>
                    <strong>Attraction Index:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.attr_index_norm}
                    </span>
                  </li>
                  <li style={{ margin: "0.5rem 0" }}>
                    <span
                      role="img"
                      aria-label="restaurant"
                      style={{ marginRight: 6 }}
                    >
                      🍽️
                    </span>
                    <strong>Restaurant Index:</strong>
                    <span style={{ color, fontWeight: 600 }}>
                      {" "}
                      {stats.rest_index_norm}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </section>
        ))
      )}

      <section className="visualization-section">
        {loadingA || loadingB ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem 0",
            }}
          >
            <CircularProgress />
          </div>
        ) : statsA && statsB ? (
          cityA.name === cityB.name ? (
            <div
              style={{
                textAlign: "center",
                margin: "2rem 0",
                fontSize: "1.2rem",
              }}
            >
              <span
                role="img"
                aria-label="facepalm"
                style={{ fontSize: "2rem", marginRight: 8 }}
              >
                🤦‍♂️
              </span>
              <strong>
                Oops! You can't compare{" "}
                <span style={{ color: "#e8c0a0" }}>{cityA.name}</span> with
                itself.
                <br />
                Even cities need a worthy rival!
              </strong>
            </div>
          ) : (
            <div className="visualization-wrapper">
              <h3>Bar Graph: City Comparison</h3>
              <div className="viz-chart viz-bar">
                <ResponsiveBar
                  data={barData}
                  keys={[cityA.name, cityB.name]}
                  indexBy="stat"
                  margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                  padding={0.3}
                  groupMode="grouped"
                  colors={{ scheme: "nivo" }}
                  axisBottom={{
                    legend: "Statistic",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    legend: "Value",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      symbolSize: 20,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
              <h3>Radar Chart: City Comparison</h3>
              <div className="viz-chart viz-radar">
                <ResponsiveRadar
                  data={radarData}
                  keys={[cityA.name, cityB.name]}
                  indexBy="stat"
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  curve="linearClosed"
                  borderWidth={2}
                  colors={{ scheme: "nivo" }}
                  dotSize={8}
                  dotColor={{ theme: "background" }}
                  dotBorderWidth={2}
                  dotBorderColor={{ from: "color" }}
                  legends={[
                    {
                      anchor: "top-left",
                      direction: "column",
                      translateX: -50,
                      translateY: -40,
                      itemWidth: 80,
                      itemHeight: 20,
                    },
                  ]}
                />
              </div>
              <h3>Scatter Plot: Guest Satisfaction vs Cleanliness</h3>
              <div className="viz-chart viz-scatter">
                <ResponsiveScatterPlot
                  data={scatterData}
                  margin={{ top: 40, right: 40, bottom: 70, left: 90 }}
                  xScale={{ type: "linear", min: "auto", max: "auto" }}
                  yScale={{ type: "linear", min: "auto", max: "auto" }}
                  xFormat=">-.2f"
                  yFormat=">-.2f"
                  axisBottom={{
                    legend: "Cleanliness Rating",
                    legendPosition: "middle",
                    legendOffset: 46,
                  }}
                  axisLeft={{
                    legend: "Guest Satisfaction",
                    legendPosition: "middle",
                    legendOffset: -60,
                  }}
                  colors={{ scheme: "category10" }}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      translateX: 130,
                      translateY: 0,
                      itemWidth: 100,
                      itemHeight: 20,
                      symbolSize: 20,
                      symbolShape: "circle",
                    },
                  ]}
                />
              </div>
            </div>
          )
        ) : (
          <p>Loading city data...</p>
        )}
      </section>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} Eurobnb Insights
      </footer>
    </div>
  );
}
