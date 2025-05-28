import React from 'react';
import CityNavigation from './components/CityNavigation';
import MapComponent from './components/MapComponent';
import './index.css';




function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="Eurobnb Logo" className="./logo_full.jpeg" />
          <h1>Eurobnb Insights</h1>
        </div>
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
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2025 Eurobnb Insights</p>
      </footer>
    </div>
  );
}




export default App;