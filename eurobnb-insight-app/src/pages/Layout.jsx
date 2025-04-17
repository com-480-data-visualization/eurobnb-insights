import MapComponent from './MapComponent'
import ParallelCoordinatesComponent from './ParallelCoordinate'

import '../css/CityNavigation.css'

export default function Layout() {
  return (
    <div>
      <nav>
        <h1>Eurobnb Insights</h1>
      </nav>
      <main>
        <MapComponent />

      </main>
      <footer>
        <p>© 2025 Eurobnb Insights</p>
      </footer>
    </div>
  )
}