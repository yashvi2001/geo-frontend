# Geospatial Data and Visualization Web Application

This is a full-stack web application for managing and visualizing geospatial data. It consists of a backend written in [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) and a frontend built using [React](https://reactjs.org/) with [react-map-gl](https://visgl.github.io/react-map-gl/).

## Features

1. **User Management and Data Upload:**
   - Users can create accounts and upload GeoJSON/KML and TIFF files.
   - Uploaded files are rendered on a map using Mapbox.
   - Users can show/hide datasets according to their preferences.

2. **Drawing and Editing Shapes:**
   - Users can draw custom shapes on the map.

3. **Hover Card Information:**
   - Displays a mini card with information when hovering over rendered files or shapes.

4. **Distance Measurement:**
   - Implements a feature to measure distances on the map in kilometers and miles.

5. **Point Marker Management:**
   - Users can add point markers on the map.
   - Point markers can be saved and moved

## Technologies Used

- **Frontend:**
  - Next
  - react-map-gl

- **Backend:**
  - Node.js
  - Express

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yashvi2001/geo-frontend.git
   ```

   ## Install Dependencies

2. **Navigate into the project directory and install the necessary dependencies using npm or yarn.**

```bash
cd geo-frontend
npm install
# or
yarn install
```

  ##  Run the Application

3. **Start the development server to run the application locally.**

```bash
npm start
# or
yarn start
```
## Open in Browser

Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.
    
## Acknowledgements

*   [Tailwind CSS](https://tailwindcss.com/): For providing the UI components and styling.
*   [Next](https://nextjs.org/): For the powerful React Framework for building user interfaces.
*   [React Map Gl](https://visgl.github.io/react-map-gl/) : For maps rendering edit and view


### NOTE - IN TIFF FILES AS OF NOW SHAPES AND MARKERS ARE NOT SUPPORTED IN THIS PROJECT 
