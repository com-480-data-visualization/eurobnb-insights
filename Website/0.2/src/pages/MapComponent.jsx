import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../css/MapComponent.css'

const cityCoordinates = {
  Amsterdam: [52.3676, 4.9041],
  Athens: [37.9838, 23.7275],
  Barcelona: [41.3851, 2.1734],
  Berlin: [52.5200, 13.4050],
  Budapest: [47.4979, 19.0402],
  Lisbon: [38.7223, -9.1393],
  London: [51.5074, -0.1278],
  Paris: [48.8566, 2.3522],
  Rome: [41.9028, 12.4964],
  Vienna: [48.2082, 16.3738],
  // Add coordinates for other cities...
}

export default function MapComponent() {
  const navigate = useNavigate()

  const cityPaths = {
    Amsterdam: '/eurobnb-insights/amsterdam',
    Athens: '/eurobnb-insights/athens',
    Barcelona: '/eurobnb-insights/barcelona',
    Berlin: '/eurobnb-insights/berlin',
    Budapest: '/eurobnb-insights/budapest',
    Lisbon: '/eurobnb-insights/lisbon',
    London: '/eurobnb-insights/london',
    Paris: '/eurobnb-insights/paris',
    Rome: '/eurobnb-insights/rome',
    Vienna: '/eurobnb-insights/vienna',
    // Add more cities and paths here
  }

  const handleButtonClick = (city) => {
    navigate(cityPaths[city] || `/${city.toLowerCase()}`)
  }

  return (
    <div className="map-wrapper">
      <MapContainer center={[43.8566, 10.3522]} zoom={4.5} className="pretty-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.entries(cityCoordinates).map(([city, coords]) => (
          <Marker
            key={city}
            position={coords}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<button class="marker-button animated">${city}</button>`,
              iconSize: [80, 40],
              iconAnchor: [40, 20],
            })}
            eventHandlers={{
              click: () => handleButtonClick(city),
            }}
          />
        ))}
      </MapContainer>
      <div className="city-legend">
        <h3>Available Cities</h3>
        <ul>
          {Object.keys(cityCoordinates).map(city => (
            <li key={city}>
              <button
                className="legend-btn"
                onClick={() => handleButtonClick(city)}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}