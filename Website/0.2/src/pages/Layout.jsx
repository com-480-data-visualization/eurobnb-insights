import MapComponent from './MapComponent';
import ParallelCoordinatesComponent from './ParallelCoordinate'; // or remove if not using yet
import CityNavigation from './CityNavigation'; // Adjust path if it's in a different folder
import '../css/Tstyles.css';

export default function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Eurobnb Insights</h1>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <CityNavigation />
        </aside>
        <main className="main-area">
          <section className="map-wrapper">
            <MapComponent />
          </section>

          <section className="metrics-grid">
            <div className="metric-card">
              <h2>Total Listings</h2>
              <p>1,234</p>
            </div>
            <div className="metric-card">
              <h2>Average Price</h2>
              <p>€85</p>
            </div>
            <div className="metric-card">
              <h2>Available Cities</h2>
              <p>12</p>
            </div>
            <div className="metric-card">
              <h2>Top District</h2>
              <p>Prague 1</p>
            </div>
          </section>

          {/* Example chart card: */}
          <section className="card chart-card">
            {/* <ParallelCoordinatesComponent /> */}
            <div style={{
              minHeight: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              color: "#aaa"
            }}>
              Chart/Visualization goes here
            </div>
          </section>
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2025 Eurobnb Insights</p>
      </footer>
    </div>
  );
}
