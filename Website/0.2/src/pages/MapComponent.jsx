import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../css/MapComponent.css'

const cityCoordinates = {
  Amsterdam: [52.3676, 4.9041],
  Athens: [37.9838, 23.7275],
  // Add coordinates for other cities...
}

export default function MapComponent() {
  const navigate = useNavigate()

  const cityPaths = {
  Amsterdam: '/eurobnb-insights/amsterdam',
  Athens: '/eurobnb-insights/athens',
  // Add more cities and paths here
  }

  const handleButtonClick = (city) => {
    navigate(cityPaths[city] || `/${city.toLowerCase()}`)
  }
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(cityCoordinates).map(([city, coords]) => (
        <Marker
          key={city}
          position={coords}
          icon={L.divIcon({
            className: 'custom-marker',
            html: `<button class="marker-button">${city}</button>`,
            iconSize: [50, 50], // Adjust size as needed
            iconAnchor: [25, 25], // Center the button
          })}
          eventHandlers={{
            click: () => handleButtonClick(city),
          }}
        />
      ))}
    </MapContainer>
  )
}