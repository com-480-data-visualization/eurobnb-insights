# EuroBnB Insights: Airbnb in Europe – Data Visualization Dashboard 🇪🇺🏨

<div align="center">

| Student's name          | SCIPER |
| ----------------------- | ------ |
| Harkeerat Singh Sawhney | 394887 |
| Daniela Gjorgjieva      | 376745 |
| Imane Jennane           | 310900 |

</div>
[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Overview

**EuroBnB Insights** is a web dashboard for interactive data visualization and analysis of Airbnb listings across ten major European cities: Amsterdam, Athens, Barcelona, Berlin, Budapest, Lisbon, London, Paris, Rome, and Vienna.  
Our goal is to help travelers, hosts, and city planners understand how short-term rentals differ and converge across Europe, using data-driven visualizations and comparative metrics.

## Features

- **Interactive Map:** Explore spatial distribution of Airbnb listings by city and district. Filter by price, room type, satisfaction, and more.
- **Colorful District Maps:** Visualize listings and rental patterns by neighborhood with custom GeoJSON boundaries (Amsterdam featured).
- **Scatter Plots:** Analyze the relationship between price and guest satisfaction for weekdays vs weekends.
- **Radar Charts:** Compare cities and room types across multiple variables like price, cleanliness, and amenities.
- **Bar Charts:** Track pricing and satisfaction patterns across cities and between weekdays and weekends.
- **Treemaps:** Instantly see which districts have the most listings and how they compare on quality or affordability metrics.
- **Responsive Design:** The dashboard works on desktop and mobile for easy exploration.

## Dataset

The project is based on detailed Airbnb datasets for each city, split into **weekday** and **weekend** snapshots.  
Each processed file includes variables such as:
- `realSum`: Price for a two-night weekend stay (in euro)
- `room_type`: Entire home/apt, private room, shared room
- `person_capacity`: Max guests
- `host_is_superhost`: Superhost flag
- `cleanliness_rating`: 0–10 scale
- `guest_satisfaction_overall`: 0–100 scale
- `dist`: Distance to city center (km)
- `metro_dist`: Distance to nearest metro
- `district`: Neighborhood/district label
- Plus normalized scores for nearby restaurants, attractions, and spatial coordinates (`lng`, `lat`)

All data is standardized across cities for fair comparisons and smooth visual integration.

## Visualizations

- **Interactive Map**: Select cities, filter listings, view tooltips for details.
- **District Color Map**: (Amsterdam example) Visualizes neighborhood-level patterns.
- **Scatter Plots**: Price vs Guest Satisfaction for Amsterdam, Berlin, Paris.
- **Radar Charts**: Compare cities and room types interactively.
- **Bar Charts**: Compare average prices and satisfaction across time/cities.
- **Treemap**: Listings by district (Vienna example).

## Challenges & Lessons Learned

- **User-Focused Simplicity:** Some advanced visualizations (e.g., parallel coordinates) were excluded for clarity and accessibility.
- **Handling Large Data:** Used clustering and filtering to keep the dashboard fast and responsive.
- **Cross-City Comparisons:** Standardized columns and variable definitions across all cities for fair analysis.
- **Multi-Library Integration:** Combined ReactJS, Mapbox, Chart.js, D3.js, and Nivo for a seamless user experience.
- **Spatial Limitations:** Interactive district-level maps are currently available only for cities with compatible GeoJSON boundaries.

## Tech Stack

- **Frontend:** ReactJS
- **Visualization:** D3.js, Chart.js, Mapbox, Leaflet, Nivo
- **Deployment:** GitHub Pages
- **Data Processing:** Python, Jupyter



## How to Run Locally

1. **Clone the repo:**  
   `git clone https://github.com/com-480-data-visualization/eurobnb-insights.git`

2. **Install dependencies:**  
   `npm install`

3. **Start the app:**  
   `npm run dev`

4. **View in browser:**  
   Go to `http://localhost:3000` (or as instructed in your terminal).

## Links, Code and Process Book

- [Website-Link](https://com-480-data-visualization.github.io/eurobnb-insights/amsterdam)
- [Process Book]()
- [Scree Cast]()
- [GitHub Repository](https://github.com/com-480-data-visualization/eurobnb-insights)



## Milestone 1 (21st March, 5pm)

Milestone 1 Report can be found in the Milestone-1 folder called as "Milestone_1_Dataviz.pdf", or in this [link](https://github.com/com-480-data-visualization/eurobnb-insights/blob/master/Milestone/Milestone-1/Milestone_1_DataViz.pdf).

## Milestone 2 (18th April, 5pm)

- 📄 **Milestone 2 Report:**  
  Available in the "Milestone-2" folder as "Milestone_2_Dataviz.pdf" or directly via [this link](https://github.com/com-480-data-visualization/eurobnb-insights/blob/master/Milestone/Milestone-2/Milestone_2_Dataviz.pdf).

- 🌐 **Prototype Website:**  
  Access the prototype online [here](https://com-480-data-visualization.github.io/eurobnb-insights/).


## Milestone 3 (30th May, 5pm)
- **Process Book**
   - The process book for Milestone 3 is available in the "Milestone-3" folder as "Process_Book.pdf" or directly via [this link]()


## License

Distributed under the MIT License.

---

## Contact

For questions, suggestions, or feedback, please use the [GitHub Issues](https://github.com/com-480-data-visualization/eurobnb-insights/issues) page.

---

## Acknowledgments

- Professor Laurent Vuillon (EPFL)
- Kaggle for the original datasets
- Open-source communities for tools and libraries

---

## Citation

If you use this project or its data for your own work, please cite the GitHub repository above.

