"use client"
import React, { useState, useEffect } from 'react';
import MapboxGL from 'react-mapbox-gl';
import { MapContainer, TileLayer, GeoJSONSource, Layer } from 'react-mapbox-gl';
const MapComponent = () => {
    const [map, setMap] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);

    // Function to handle GeoJSON file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => setGeojsonData(JSON.parse(e.target.result));
        reader.readAsText(file);
    };

    // Map initialization logic (to be executed after GeoJSON is loaded)
    useEffect(() => {
        const initializeMap = async () => {
            if (geojsonData) {
                const { accessToken } =  "pk.eyJ1IjoieWFzaHZpLTEyMyIsImEiOiJjbHc4MjdzNDMxbW1hMnRyem9zNWphbHl6In0.FWrh9nJuTu0oM0e20OnRaQ"; // Replace with your token

                const newMap = new MapboxGL.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v11', // Choose a Mapbox style
                    center: [-74.50, 40.7], // Initial center coordinates (adjust as needed)
                    zoom: 9, // Initial zoom level
                    accessToken,
                });

                setMap(newMap);

                // Add GeoJSON source and layer when map is loaded
                newMap.on('load', () => {
                    newMap.addSource('my-geojson', {
                        type: 'geojson',
                        data: geojsonData,
                    });

                    newMap.addLayer({
                        id: 'my-geojson-layer',
                        type: 'fill' || 'line' || 'circle', // Choose layer type based on GeoJSON geometry
                        source: 'my-geojson',
                        paint: {
                            // Customize layer paint properties according to your GeoJSON data
                            'fill-color': '#f00', // Example for fill layer
                        },
                    });
                });
            }
        };

        initializeMap();
    }, [geojsonData]);

    return (
        <div>
            <input type="file" accept=".geojson" onChange={handleFileUpload} />
            {map && <MapContainer style={{ width: '100%', height: '400px' }} map={map} />}
        </div>
    );
};

export default MapComponent;
