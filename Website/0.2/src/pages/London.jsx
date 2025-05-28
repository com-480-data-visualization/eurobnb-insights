import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import React, { useEffect, useState } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import "../css/LondonPage.css";
import { data } from "react-router-dom";

const London = () => {
  const [dayType, setDayType] = useState("weekday");
  const [districts, setDistricts] = useState(null);
  const [listings, setListings] = useState([]);
  const [weekdayListings, setWeekdayListings] = useState([]);
  const [weekendListings, setWeekendListings] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  fetch("./london.geojson")
    .then((res) => res.json())
    .then((data) => setDistricts(data))
}, []);


  useEffect(() => {
    Papa.parse(
      "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/london_weekdays.csv",
      {
        download: true,
        header: true,
        complete: (results) => setWeekdayListings(results.data),
      }
    );
    Papa.parse(
      "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/london_weekends.csv",
      {
        download: true,
        header: true,
        complete: (results) => setWeekendListings(results.data),
      }
    );
  }, []);

  useEffect(() => {
    const url =
      dayType === "weekday"
        ? "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/london_weekdays.csv"
        : "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/refs/heads/master/Dataset/Processed-Dataset/london_weekends.csv";
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        setListings(results.data);
      },
    });
  }, [dayType]);

  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to hex color
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
  }

  const districtStyle = (feature) => {
    const name =
      feature.properties.Buurtnaam || feature.properties.name || "Unknown";
    return {
      fillColor: stringToColor(name),
      weight: 2,
      opacity: 1,
      color: "black",
      fillOpacity: 0.4,
    };
  };

  const onEachDistrict = (district, layer) => {
    // Use Buurtnaam and Wijkcode from your geojson properties
    const { Buurtnaam, Wijkcode } = district.properties;
    layer.bindPopup(
      `<b>${Buurtnaam || "District"}</b><br>Zone: ${Wijkcode || "N/A"}`
    );
  };

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const barGraphData = [
    { name: "Centrum", listings: 120 },
    { name: "West Zone", listings: 80 },
    { name: "East Zone", listings: 60 },
    { name: "Oost", listings: 40 },
  ];

  const [filters, setFilters] = useState({
    district: "",
    room_type: "",
    host_is_superhost: "",
    bedrooms: "",
    person_capacity: "",
    cleanliness_rating: "",
    guest_satisfaction_overall: "",
    // Add more fields as needed
  });
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    // Apply filters whenever listings or filters change
    let filtered = listings.filter((listing) => {
      // District filter
      if (filters.district && listing.district !== filters.district)
        return false;
      // Room type filter
      if (filters.room_type && listing.room_type !== filters.room_type)
        return false;
      // Superhost filter
      if (
        filters.host_is_superhost &&
        listing.host_is_superhost !== filters.host_is_superhost
      )
        return false;
      // Bedrooms filter (as string or number)
      if (filters.bedrooms && String(listing.bedrooms) !== filters.bedrooms)
        return false;
      // Person capacity filter
      if (
        filters.person_capacity &&
        String(listing.person_capacity) !== filters.person_capacity
      )
        return false;
      // Cleanliness rating filter (minimum)
      if (
        filters.cleanliness_rating &&
        Number(listing.cleanliness_rating) < Number(filters.cleanliness_rating)
      )
        return false;
      // Guest satisfaction filter (minimum)
      if (
        filters.guest_satisfaction_overall &&
        Number(listing.guest_satisfaction_overall) <
          Number(filters.guest_satisfaction_overall)
      )
        return false;
      return true;
    });
    setFilteredListings(filtered);
  }, [listings, filters]);

  // Get unique values for dropdowns
  const unique = (arr, key) => [
    ...new Set(arr.map((item) => item[key]).filter(Boolean)),
  ];

  const groupByOptions = [
    { value: "district", label: "District" },
    { value: "room_type", label: "Room Type" },
    { value: "host_is_superhost", label: "Superhost Status" },
  ];

  const aggregateOptions = [
    { value: "count", label: "Count of Listings" },
    { value: "realSum", label: "Total Revenue (realSum)" },
    { value: "cleanliness_rating", label: "Average Cleanliness" },
    {
      value: "guest_satisfaction_overall",
      label: "Average Guest Satisfaction",
    },
  ];

  const [groupBy, setGroupBy] = useState("district");
  const [aggregate, setAggregate] = useState("count");

  // Compute treemap data based on dropdowns
  const treemapData = React.useMemo(() => {
    const grouped = {};
    filteredListings.forEach((listing) => {
      const key = listing[groupBy];
      // Only group if the group-by field is present and not empty/null/undefined
      if (key !== undefined && key !== null && key !== "") {
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(listing);
      }
    });
    return Object.entries(grouped).map(([name, listings]) => {
      let size = 0;
      if (aggregate === "count") size = listings.length;
      else if (aggregate === "realSum")
        size = listings.reduce((sum, l) => sum + Number(l.realSum || 0), 0);
      else if (aggregate === "cleanliness_rating")
        size =
          listings.reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / listings.length;
      else if (aggregate === "guest_satisfaction_overall")
        size =
          listings.reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / listings.length;
      return { name, size: Number(size.toFixed(2)), fill: stringToColor(name) };
    });
  }, [filteredListings, groupBy, aggregate]);

  const treemapDataBoth = React.useMemo(() => {
    if (!compareMode || !weekdayListings.length || !weekendListings.length)
      return [];
    // ...existing code...
    const groupData = (arr) => {
      const grouped = {};
      arr.forEach((listing) => {
        const key = listing[groupBy];
        if (key !== undefined && key !== null && key !== "") {
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(listing);
        }
      });
      return grouped;
    };
    const weekdayGrouped = groupData(weekdayListings);
    const weekendGrouped = groupData(weekendListings);

    const allKeys = Array.from(
      new Set([...Object.keys(weekdayGrouped), ...Object.keys(weekendGrouped)])
    );

    return allKeys.map((name) => {
      let sizeWeekday = 0,
        sizeWeekend = 0;
      if (aggregate === "count") {
        sizeWeekday = (weekdayGrouped[name] || []).length;
        sizeWeekend = (weekendGrouped[name] || []).length;
      } else if (aggregate === "realSum") {
        sizeWeekday = (weekdayGrouped[name] || []).reduce(
          (sum, l) => sum + Number(l.realSum || 0),
          0
        );
        sizeWeekend = (weekendGrouped[name] || []).reduce(
          (sum, l) => sum + Number(l.realSum || 0),
          0
        );
      } else if (aggregate === "cleanliness_rating") {
        sizeWeekday =
          (weekdayGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / ((weekdayGrouped[name] || []).length || 1);
        sizeWeekend =
          (weekendGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / ((weekendGrouped[name] || []).length || 1);
      } else if (aggregate === "guest_satisfaction_overall") {
        sizeWeekday =
          (weekdayGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / ((weekdayGrouped[name] || []).length || 1);
        sizeWeekend =
          (weekendGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / ((weekendGrouped[name] || []).length || 1);
      }
      return {
        name,
        Weekday: Number(sizeWeekday.toFixed(2)),
        Weekend: Number(sizeWeekend.toFixed(2)),
        fill: stringToColor(name),
      };
    });
  }, [
    compareMode,
    weekdayListings,
    weekendListings,
    groupBy,
    aggregate,
    stringToColor,
  ]);

  const treemapDataWeekday = treemapDataBoth?.map((d) => ({
    name: d.name,
    size: d.Weekday,
    fill: d.fill,
  }));

  const treemapDataWeekend = treemapDataBoth?.map((d) => ({
    name: d.name,
    size: d.Weekend,
    fill: d.fill,
  }));

  const barGroupByOptions = [
    { value: "district", label: "District" },
    { value: "room_type", label: "Room Type" },
    { value: "host_is_superhost", label: "Superhost Status" },
    { value: "bedrooms", label: "Bedrooms" },
    { value: "person_capacity", label: "Person Capacity" },
  ];

  const barAggregateOptions = [
    { value: "count", label: "Count of Listings" },
    { value: "realSum", label: "Total Revenue (realSum)" },
    { value: "cleanliness_rating", label: "Average Cleanliness" },
    {
      value: "guest_satisfaction_overall",
      label: "Average Guest Satisfaction",
    },
  ];

  const [barGroupBy, setBarGroupBy] = useState("district");
  const [barAggregate, setBarAggregate] = useState("count");

  const barChartData = React.useMemo(() => {
    const grouped = {};
    filteredListings.forEach((listing) => {
      // Only group if the group-by field is present and not empty/null/undefined
      const key = listing[barGroupBy];
      if (key !== undefined && key !== null && key !== "") {
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(listing);
      }
    });
    return Object.entries(grouped).map(([name, listings]) => {
      let value = 0;
      if (barAggregate === "count") value = listings.length;
      else if (barAggregate === "realSum")
        value = listings.reduce((sum, l) => sum + Number(l.realSum || 0), 0);
      else if (barAggregate === "cleanliness_rating")
        value =
          listings.reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / listings.length;
      else if (barAggregate === "guest_satisfaction_overall")
        value =
          listings.reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / listings.length;
      return { name, value: Number(value.toFixed(2)) };
    });
  }, [filteredListings, barGroupBy, barAggregate]);

  const barChartDataBoth = React.useMemo(() => {
    if (!compareMode) return null;
    const groupData = (arr) => {
      const grouped = {};
      arr.forEach((listing) => {
        const key = listing[barGroupBy];
        if (key !== undefined && key !== null && key !== "") {
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(listing);
        }
      });
      return grouped;
    };
    const weekdayGrouped = groupData(weekdayListings);
    const weekendGrouped = groupData(weekendListings);

    const allKeys = Array.from(
      new Set([...Object.keys(weekdayGrouped), ...Object.keys(weekendGrouped)])
    );

    return allKeys.map((name) => {
      let valueWeekday = 0,
        valueWeekend = 0;
      if (barAggregate === "count") {
        valueWeekday = (weekdayGrouped[name] || []).length;
        valueWeekend = (weekendGrouped[name] || []).length;
      } else if (barAggregate === "realSum") {
        valueWeekday = (weekdayGrouped[name] || []).reduce(
          (sum, l) => sum + Number(l.realSum || 0),
          0
        );
        valueWeekend = (weekendGrouped[name] || []).reduce(
          (sum, l) => sum + Number(l.realSum || 0),
          0
        );
      } else if (barAggregate === "cleanliness_rating") {
        valueWeekday =
          (weekdayGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / ((weekdayGrouped[name] || []).length || 1);
        valueWeekend =
          (weekendGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.cleanliness_rating || 0),
            0
          ) / ((weekendGrouped[name] || []).length || 1);
      } else if (barAggregate === "guest_satisfaction_overall") {
        valueWeekday =
          (weekdayGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / ((weekdayGrouped[name] || []).length || 1);
        valueWeekend =
          (weekendGrouped[name] || []).reduce(
            (sum, l) => sum + Number(l.guest_satisfaction_overall || 0),
            0
          ) / ((weekendGrouped[name] || []).length || 1);
      }
      return {
        name,
        Weekday: Number(valueWeekday.toFixed(2)),
        Weekend: Number(valueWeekend.toFixed(2)),
      };
    });
  }, [compareMode, weekdayListings, weekendListings, barGroupBy, barAggregate]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            padding: "0.7em 1em",
            borderRadius: 6,
            fontSize: "0.95em",
          }}
        >
          <b>{data.name}</b>
          <br />
          {aggregate === "count" && (
            <>
              Listings: <b>{data.size}</b>
            </>
          )}
          {aggregate === "realSum" && (
            <>
              Total Revenue: <b>€{data.size}</b>
            </>
          )}
          {aggregate === "cleanliness_rating" && (
            <>
              Avg. Cleanliness: <b>{data.size}/10</b>
            </>
          )}
          {aggregate === "guest_satisfaction_overall" && (
            <>
              Avg. Guest Satisfaction: <b>{data.size}/100</b>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Radar chart data: average metrics per district (top 5 by listing count)
  // Define all relevant variables for radar chart
  const RADAR_VARIABLES = [
    { key: "realSum", label: "Price (€)" },
    { key: "cleanliness_rating", label: "Cleanliness" },
    { key: "guest_satisfaction_overall", label: "Satisfaction" },
    { key: "person_capacity", label: "Capacity" },
    { key: "bedrooms", label: "Bedrooms" },
    { key: "dist", label: "Distance to Center (km)" },
    { key: "metro_dist", label: "Distance to Metro (km)" },
    // You can add more if needed
  ];

  // Comparison options
  const RADAR_COMPARE_OPTIONS = [
    { value: "room_type", label: "Room Type" },
    { value: "district", label: "District" },
    { value: "host_is_superhost", label: "Superhost Status" },
  ];

  // Add state for selected metrics and comparison
  const [radarSelectedMetrics, setRadarSelectedMetrics] = useState([
    "realSum",
    "cleanliness_rating",
    "guest_satisfaction_overall",
    "person_capacity",
  ]);
  const [radarCompareBy, setRadarCompareBy] = useState("room_type");

  // Dynamically compute radar groups (top 3 by count)
  const radarGroups = React.useMemo(() => {
    const counts = {};
    filteredListings.forEach((l) => {
      const group = (l[radarCompareBy] || "").toString().trim();
      if (!counts[group]) counts[group] = 0;
      counts[group]++;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);
  }, [filteredListings, radarCompareBy]);

  // Only use selected metrics
  const radarMetrics = RADAR_VARIABLES.filter((v) =>
    radarSelectedMetrics.includes(v.key)
  );

  // Radar data generator (same as before, but uses radarGroups and radarMetrics)
  const getRadarDataByGroup = (listings, groups) => {
    // 1. Compute min/max for each metric
    const metricStats = {};
    radarMetrics.forEach((metric) => {
      let values = [];
      groups.forEach((group) => {
        const items = listings.filter(
          (l) => (l[radarCompareBy] || "").toString().trim() === group
        );
        if (items.length) {
          const avg =
            items.reduce((sum, l) => sum + Number(l[metric.key] || 0), 0) /
            items.length;
          values.push(avg);
        }
      });
      metricStats[metric.key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    // 2. Build normalized data for radar chart
    return radarMetrics.map((metric) => {
      const obj = { metric: metric.label };
      groups.forEach((group) => {
        const items = listings.filter(
          (l) => (l[radarCompareBy] || "").toString().trim() === group
        );
        if (items.length) {
          const avg =
            items.reduce((sum, l) => sum + Number(l[metric.key] || 0), 0) /
            items.length;
          const { min, max } = metricStats[metric.key];
          let normalized = max !== min ? (avg - min) / (max - min) : 0.5;
          normalized = Number((normalized * 100).toFixed(2));
          obj[group] = normalized;
        } else {
          obj[group] = 0;
        }
      });
      return obj;
    });
  };

  const radarChartDataWeekday = React.useMemo(
    () => getRadarDataByGroup(weekdayListings, radarGroups),
    [weekdayListings, radarGroups, radarMetrics, radarCompareBy]
  );
  const radarChartDataWeekend = React.useMemo(
    () => getRadarDataByGroup(weekendListings, radarGroups),
    [weekendListings, radarGroups, radarMetrics, radarCompareBy]
  );
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`london-dashboard-page ${dayType}-theme`}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "var(--header-bg)",
          padding: "1rem 0",
          borderBottom: "1.5px solid #e2e8f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Back to Homepage button */}
        <button
          onClick={() => navigate("/eurobnb-insights")}
          style={{
            position: "absolute",
            left: 30,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#f1f1fa",
            color: "#2d3748",
            border: "1.5px solid #bbb",
            borderRadius: 7,
            padding: "0.5em 1.3em",
            fontWeight: 600,
            fontSize: "1em",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(60,60,120,0.07)",
          }}
        >
          ← Back to Homepage
        </button>
        <button
          onClick={() => setDayType("weekday")}
          style={{
            padding: "0.5em 1.2em",
            borderRadius: 6,
            border:
              dayType === "weekday" ? "2px solid #6366f1" : "1px solid #bbb",
            background: dayType === "weekday" ? "#6366f1" : "#fff",
            color: dayType === "weekday" ? "#fff" : "#222",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Weekday
        </button>
        <button
          onClick={() => setDayType("weekend")}
          style={{
            padding: "0.5em 1.2em",
            borderRadius: 6,
            border:
              dayType === "weekend" ? "2px solid #e74c3c" : "1px solid #bbb",
            background: dayType === "weekend" ? "#e74c3c" : "#fff",
            color: dayType === "weekend" ? "#fff" : "#222",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >

          Weekend
        </button>
      </div>
      {/* ====== HEADER STORYTELLING SECTION ====== */}
      <section
        className="dashboard-header-card"
        style={{
          background: "var(--header-bg)",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(60,60,120,0.07)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          margin: "2rem auto 2.5rem auto",
          maxWidth: 1500,
          border: "1px solid #e0e0e0",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <div style={{ fontSize: "3.5rem", lineHeight: 1 }}>
            <span role="img" aria-label="london">
                🏛️
            </span>
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: "2.5rem",
                letterSpacing: 0.5,
                color: "#2d3748",
              }}
            >
              london Airbnb Data Story
            </h1>
            <div
              style={{
                fontSize: "1.15rem",
                color: "#4a5568",
                marginTop: "0.7rem",
                fontWeight: 500,
                maxWidth: 700,
              }}
            >
              Explore how Airbnb listings are distributed across london’s
              districts.
              <br />
              Discover which zones lead in listings, compare price/rating, and
              interact with the map and charts to reveal trends.
            </div>
          </div>
        </div>
        <hr
          style={{
            margin: "2rem 0 0 0",
            border: "none",
            borderTop: "1.5px solid #e2e8f0",
          }}
        />
      </section>
      {/* ====== FILTERS ABOVE MAP ====== */}
      <div
        className="london-filters-row"
        style={{
          marginBottom: "2rem",
          background: "var(--header-bg)",
          padding: "2rem 2.5rem",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid #e0e0e0",
          position: "relative",
          maxWidth: 1500,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.2rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "1.35rem",
              letterSpacing: 0.2,
            }}
          >
            <span role="img" aria-label="filter">
              🔎
            </span>{" "}
            Filter Listings
          </h2>
          <button
            type="button"
            className="filter-toggle-btn"
            style={{
              background: "var(--header-bg)",
              border: "1px solid #bbb",
              borderRadius: 6,
              padding: "0.4em 1em",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1em",
              color: "#2d3748",
            }}
            onClick={() => setShowFilters((f) => !f)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {showFilters && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="filter-form"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem 2.5rem",
              alignItems: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <label className="filter-label">
              <span role="img" aria-label="district">
                🏙️
              </span>{" "}
              District:
              <select
                className="filter-select"
                value={filters.district}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, district: e.target.value }))
                }
              >
                <option value="">All</option>
                {unique(listings, "district").map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              <span role="img" aria-label="room">
                🛏️
              </span>{" "}
              Room Type:
              <select
                className="filter-select"
                value={filters.room_type}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, room_type: e.target.value }))
                }
              >
                <option value="">All</option>
                {unique(listings, "room_type").map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              <span role="img" aria-label="superhost">
                ⭐
              </span>{" "}
              Superhost:
              <select
                className="filter-select"
                value={filters.host_is_superhost}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    host_is_superhost: e.target.value,
                  }))
                }
              >
                <option value="">All</option>
                <option value="t">Yes</option>
                <option value="f">No</option>
              </select>
            </label>
            <label className="filter-label">
              <span role="img" aria-label="bedrooms">
                🛌
              </span>{" "}
              Bedrooms:
              <select
                className="filter-select"
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, bedrooms: e.target.value }))
                }
              >
                <option value="">All</option>
                {unique(listings, "bedrooms").map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              <span role="img" aria-label="capacity">
                👥
              </span>{" "}
              Person Capacity:
              <select
                className="filter-select"
                value={filters.person_capacity}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, person_capacity: e.target.value }))
                }
              >
                <option value="">All</option>
                {unique(listings, "person_capacity").map((pc) => (
                  <option key={pc} value={pc}>
                    {pc}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              <span role="img" aria-label="cleanliness">
                🧼
              </span>{" "}
              Min Cleanliness:
              <input
                className="filter-input"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.cleanliness_rating}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    cleanliness_rating: e.target.value,
                  }))
                }
                placeholder="e.g. 8"
              />
            </label>
            <label className="filter-label">
              <span role="img" aria-label="satisfaction">
                😊
              </span>{" "}
              Min Guest Satisfaction:
              <input
                className="filter-input"
                type="number"
                min="0"
                max="100"
                step="1"
                value={filters.guest_satisfaction_overall}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    guest_satisfaction_overall: e.target.value,
                  }))
                }
                placeholder="e.g. 80"
              />
            </label>
            <button
              className="filter-btn"
              type="button"
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.6em 1.5em",
                fontWeight: 600,
                marginLeft: "auto",
                marginTop: "0.5em",
                cursor: "pointer",
              }}
              onClick={() => setFilters({})}
            >
              Clear Filters
            </button>
          </form>
        )}
      </div>
      {/* ====== MAP CARD ====== */}
      <div
        className="london-map-card"
        style={{
          background: "var(--header-bg)",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(60,60,120,0.07)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          margin: "2rem auto 2.5rem auto",
          maxWidth: 1500,
          border: "1px solid #e0e0e0",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "1.7rem",
            letterSpacing: 0.5,
            color: "#2d3748",
            marginBottom: "0.5rem",
          }}
        >
          <span role="img" aria-label="map">
            🗺️
          </span>{" "}
          london Airbnb Map
        </h2>
        <div
          style={{
            fontSize: "1.05rem",
            color: "#4a5568",
            marginBottom: "1.2rem",
            fontWeight: 500,
            maxWidth: 700,
          }}
        >
          Explore the spatial distribution of Airbnb listings. Click on markers
          or districts for more details.
        </div>
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            marginBottom: "1.2rem",
          }}
        >
          <MapContainer
            center={[51.5072, -0.1276]}
            zoom={13}
            style={{ height: "700px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
            />
            {districts && (
              <GeoJSON
                data={districts}
                style={districtStyle}
                onEachFeature={onEachDistrict}
              />
            )}
            {/* Render a marker for each filtered listing */}
            {filteredListings
              .filter(
                (listing) =>
                  listing.lat !== undefined &&
                  listing.lng !== undefined &&
                  listing.lat !== "" &&
                  listing.lng !== "" &&
                  !isNaN(parseFloat(listing.lat)) &&
                  !isNaN(parseFloat(listing.lng))
              )
              .map((listing, idx) => (
                <Marker
                  key={idx}
                  position={[parseFloat(listing.lat), parseFloat(listing.lng)]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <h3>
                        {listing.room_type} in {listing.district}
                      </h3>
                      <p>
                        <b>Price:</b> €{Math.round(listing.realSum)}
                      </p>
                      <p>
                        <b>Capacity:</b> {listing.person_capacity} guests
                      </p>
                      <p>
                        <b>Bedrooms:</b> {listing.bedrooms}
                      </p>
                      <p>
                        <b>Superhost:</b>{" "}
                        {listing.host_is_superhost === "t" ? "Yes" : "No"}
                      </p>
                      <p>
                        <b>Cleanliness:</b>
                        <span className="star-bar">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`star ${
                                i <
                                Math.round(
                                  (listing.cleanliness_rating / 10) * 5
                                )
                                  ? "filled"
                                  : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: "0.9em",
                            color: "#888",
                          }}
                        >
                          {listing.cleanliness_rating}/10
                        </span>
                      </p>
                      <p>
                        <b>Guest Satisfaction:</b>
                        <span className="star-bar">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`star ${
                                i <
                                Math.round(
                                  (listing.guest_satisfaction_overall / 100) * 5
                                )
                                  ? "filled"
                                  : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: "0.9em",
                            color: "#888",
                          }}
                        >
                          {listing.guest_satisfaction_overall}/100
                        </span>
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
        <div
          className="map-caption"
          style={{
            background: "var(--header-bg)",
            borderRadius: "8px",
            padding: "0.7em 1.2em",
            fontSize: "1.05em",
            color: "#4a5568",
            border: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <span role="img" aria-label="info">
            ℹ️
          </span>
          Click zones or markers for details. Zoom and pan to explore different
          neighborhoods.
        </div>
      </div>{" "}
      {/* End of map card */}
      {/* ====== KEY INSIGHTS SECTION ====== */}
      <div
        className="london-key-insights"
        style={{
          background: "var(--header-bg)",
          borderRadius: "14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "2rem 2.5rem",
          margin: "2rem auto 0 auto",
          maxWidth: 1500,
          border: "1px solid #e0e0e0",
          display: "flex",
          gap: "2.5rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {(() => {
          // Compute averages from filteredListings
          const count = filteredListings.length;
          const avg = (arr, key) =>
            arr.length
              ? (
                  arr.reduce((sum, l) => sum + Number(l[key] || 0), 0) /
                  arr.length
                ).toFixed(2)
              : "N/A";
          const avgPrice = avg(filteredListings, "realSum");
          const avgDist = avg(filteredListings, "dist");
          const avgMetroDist = avg(filteredListings, "metro_dist");
          const avgSatisfaction = avg(
            filteredListings,
            "guest_satisfaction_overall"
          );
          const avgCleanliness = avg(filteredListings, "cleanliness_rating");
          return (
            <>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Average Airbnb Price
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <span style={{ fontSize: "1.2rem", color: "#888" }}>€</span>
                  <b>{avgPrice}</b>
                </div>
              </div>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Average Distance to Center (km)
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <b>{avgDist}</b>
                </div>
              </div>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Average Distance to Metro (km)
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <b>{avgMetroDist}</b>
                </div>
              </div>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Average Guest Satisfaction
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <b>{avgSatisfaction}</b>
                  <span style={{ fontSize: "1.1rem", color: "#888" }}>
                    /100
                  </span>
                </div>
              </div>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Average Cleanliness Rating
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <b>{avgCleanliness}</b>
                  <span style={{ fontSize: "1.1rem", color: "#888" }}>/10</span>
                </div>
              </div>
              <div>
                <div style={{ color: "#4a5568", fontWeight: 500 }}>
                  Listings Shown
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#2d3748",
                  }}
                >
                  <b>{count}</b>
                </div>
              </div>
            </>
          );
        })()}
      </div>
      {/* ====== VISUALIZATIONS SECTION ====== */}
      <div
        className="london-visuals-row"
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          marginTop: "2.5rem",
        }}
      >
        {/* ====== TREEMAP CARD ====== */}
        <div
          className="visual-card"
          style={{
            background: "var(--header-bg)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(60,60,120,0.07)",
            padding: "2rem 2rem 1.5rem 2rem",
            flex: "1 1 420px",
            minWidth: 350,
            border: "1px solid #e0e0e0",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              role="img"
              aria-label="treemap"
              style={{ fontSize: "1.6rem" }}
            >
              🌳
            </span>
            <h3
              className="section-title"
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#2d3748",
              }}
            >
              Treemap: Listings Proportion by Zone
            </h3>
          </div>
          <div
            style={{
              fontSize: "1.02rem",
              color: "#4a5568",
              marginBottom: "1.1rem",
              fontWeight: 500,
            }}
          >
            Visualize the share of listings, revenue, or ratings by district or
            room type. Hover for details.
          </div>
          <hr
            style={{
              margin: "0 0 1.2rem 0",
              border: "none",
              borderTop: "1.5px solid #e2e8f0",
            }}
          />
          <div
            className="london-filters-row"
            style={{
              marginBottom: "1.2rem",
              background: "var(--header-bg)",
              padding: "0.7rem 1.2rem",
              borderRadius: "8px",
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-end",
            }}
          >
            <label className="filter-label">
              Group by:
              <select
                className="filter-select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                {groupByOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              Aggregate:
              <select
                className="filter-select"
                value={aggregate}
                onChange={(e) => setAggregate(e.target.value)}
              >
                {aggregateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
              aspectRatio={4 / 3}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
          <div
            className="viz-caption"
            style={{
              background: "var(--header-bg)",
              borderRadius: "8px",
              padding: "0.6em 1em",
              fontSize: "1.01em",
              color: "#4a5568",
              border: "1px solid #e0e0e0",
              marginTop: "1.1rem",
            }}
          >
            <span role="img" aria-label="info">
              ℹ️
            </span>
            {groupByOptions.find((opt) => opt.value === groupBy)?.label} shown
            by {aggregateOptions.find((opt) => opt.value === aggregate)?.label}.
            Hover for zone sizes.
          </div>
        </div>

        {/* ====== BAR CHART CARD ====== */}
        <div
          className="visual-card"
          style={{
            background: "var(--header-bg)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(60,60,120,0.07)",
            padding: "2rem 2rem 1.5rem 2rem",
            flex: "1 1 420px",
            minWidth: 350,
            border: "1px solid #e0e0e0",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              role="img"
              aria-label="bar chart"
              style={{ fontSize: "1.6rem" }}
            >
              📊
            </span>
            <h3
              className="section-title"
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#2d3748",
              }}
            >
              Bar Chart: Compare Airbnb Metrics
            </h3>
          </div>
          {/* Compare Switch - moved here */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <label className="switch">
              <input
                type="checkbox"
                id="compareMode"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
            <label
              htmlFor="compareMode"
              style={{ fontWeight: 500, cursor: "pointer", marginLeft: 6 }}
            >
              Compare Weekday vs Weekend
            </label>
          </div>
          <div
            style={{
              fontSize: "1.02rem",
              color: "#4a5568",
              marginBottom: "1.1rem",
              fontWeight: 500,
            }}
          >
            Compare metrics like count, revenue, or ratings by group. Use
            dropdowns to customize axes.
          </div>
          <div
            className="london-filters-row"
            style={{
              marginBottom: "1.2rem",
              background: "var(--header-bg)",
              padding: "0.7rem 1.2rem",
              borderRadius: "8px",
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-end",
            }}
          >
            <label className="filter-label">
              X-Axis:
              <select
                className="filter-select"
                value={barGroupBy}
                onChange={(e) => setBarGroupBy(e.target.value)}
              >
                {barGroupByOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-label">
              Y-Axis:
              <select
                className="filter-select"
                value={barAggregate}
                onChange={(e) => setBarAggregate(e.target.value)}
              >
                {barAggregateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {compareMode ? (
              <BarChart data={barChartDataBoth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Weekday" fill="#6366f1" name="Weekday" />
                <Bar dataKey="Weekend" fill="#e74c3c" name="Weekend" />
                <Legend />
              </BarChart>
            ) : (
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
          <div
            className="viz-caption"
            style={{
              background: "var(--header-bg)",
              borderRadius: "8px",
              padding: "0.6em 1em",
              fontSize: "1.01em",
              color: "#4a5568",
              border: "1px solid #e0e0e0",
              marginTop: "1.1rem",
            }}
          >
            <span role="img" aria-label="info">
              ℹ️
            </span>
            {barGroupByOptions.find((opt) => opt.value === barGroupBy)?.label}{" "}
            by{" "}
            {
              barAggregateOptions.find((opt) => opt.value === barAggregate)
                ?.label
            }
            .
          </div>
        </div>
      </div>
      {/* ====== RADAR CHART CARD BELOW ====== */}
      <div
        className="visual-card"
        style={{
          background: "var(--header-bg)",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(60,60,120,0.07)",
          padding: "2rem 2rem 1.5rem 2rem",
          flex: "1 1 420px",
          minWidth: 350,
          border: "1px solid #e0e0e0",
          position: "relative",
          marginTop: "2rem",
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "0.5rem",
          }}
        >
          <span role="img" aria-label="radar" style={{ fontSize: "1.6rem" }}>
            📈
          </span>
          <h3
            className="section-title"
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#2d3748",
            }}
          >
            Radar Chart: Compare Groups
          </h3>
        </div>
        <div
          style={{
            fontSize: "1.02rem",
            color: "#4a5568",
            marginBottom: "1.1rem",
            fontWeight: 500,
          }}
        >
          Select metrics and comparison group for the radar chart.
        </div>
        <hr
          style={{
            margin: "0 0 1.2rem 0",
            border: "none",
            borderTop: "1.5px solid #e2e8f0",
          }}
        />
        {/* Radar controls */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            marginBottom: "1.2rem",
            flexWrap: "wrap",
            background: "#f7f8fa",
            borderRadius: "10px",
            padding: "1.1rem 1.5rem",
            border: "1px solid #e0e0e0",
            alignItems: "flex-start",
          }}
        >
          <div>
            <label style={{ fontWeight: 600, marginRight: 8 }}>
              Compare by:
            </label>
            <select
              value={radarCompareBy}
              onChange={(e) => setRadarCompareBy(e.target.value)}
              style={{
                padding: "0.45em 1.1em",
                borderRadius: 7,
                border: "1.5px solid #bfc3d1",
                fontWeight: 500,
                fontSize: "1em",
                background: "#fff",
                color: "#2d3748",
                outline: "none",
                transition: "border 0.2s",
              }}
            >
              {RADAR_COMPARE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginRight: 8 }}>Metrics:</label>
            <button
              type="button"
              style={{
                marginRight: 12,
                padding: "0.25em 0.8em",
                borderRadius: 6,
                border: "1px solid #bbb",
                background: "#f1f1fa",
                color: "#444",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "0.97em",
                marginBottom: 6,
              }}
              onClick={() => {
                if (radarSelectedMetrics.length === RADAR_VARIABLES.length) {
                  setRadarSelectedMetrics([]);
                } else {
                  setRadarSelectedMetrics(RADAR_VARIABLES.map((v) => v.key));
                }
              }}
            >
              {radarSelectedMetrics.length === RADAR_VARIABLES.length
                ? "Deselect All"
                : "Select All"}
            </button>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5em 1.2em" }}
            >
              {RADAR_VARIABLES.map((v) => (
                <label
                  key={v.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                    fontSize: "1em",
                    cursor: "pointer",
                    userSelect: "none",
                    gap: "0.45em",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={radarSelectedMetrics.includes(v.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRadarSelectedMetrics((m) => [...m, v.key]);
                      } else {
                        setRadarSelectedMetrics((m) =>
                          m.filter((k) => k !== v.key)
                        );
                      }
                    }}
                    style={{
                      accentColor: "#6366f1",
                      width: 18,
                      height: 18,
                      marginRight: 4,
                      borderRadius: 4,
                      border: "1.5px solid #bbb",
                      boxShadow: "0 1px 2px rgba(60,60,120,0.07)",
                    }}
                  />
                  {v.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <hr
          style={{
            margin: "1.2rem 0 1.2rem 0",
            border: "none",
            borderTop: "1.5px solid #e2e8f0",
          }}
        />
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart
            data={
              dayType === "weekday"
                ? radarChartDataWeekday
                : radarChartDataWeekend
            }
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="metric"
              style={{ fontWeight: 600, fontSize: "1.05em" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tickFormatter={(v) => `${v}%`}
            />
            {radarGroups.map((group, idx) => (
              <Radar
                key={group}
                name={group}
                dataKey={group}
                stroke={`hsl(${(idx * 120) % 360},70%,45%)`}
                fill={`hsl(${(idx * 120) % 360},70%,65%)`}
                fillOpacity={0.25}
              />
            ))}
            <Legend wrapperStyle={{ fontWeight: 600, fontSize: "1em" }} />
          </RadarChart>
        </ResponsiveContainer>
        <div
          className="viz-caption"
          style={{
            background: "var(--header-bg)",
            borderRadius: "8px",
            padding: "0.6em 1em",
            fontSize: "1.01em",
            color: "#4a5568",
            border: "1px solid #e0e0e0",
            marginTop: "1.1rem",
          }}
        >
          <span role="img" aria-label="info">
            ℹ️
          </span>
          Top 3{" "}
          {RADAR_COMPARE_OPTIONS.find(
            (opt) => opt.value === radarCompareBy
          )?.label.toLowerCase()}
          s compared across selected metrics (
          {dayType === "weekday" ? "Weekday" : "Weekend"}).
        </div>
      </div>
    </div>
  );
};

export default London;
