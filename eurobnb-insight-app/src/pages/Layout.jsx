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
      <section>
        <h2>City to City Visualization</h2>
        <p>Here 2 different visualizations would be shown to show a City vs City</p>
      </section>
      <footer>
        <p>© 2025 Eurobnb Insights</p>
      </footer>
    </div>
  )
}