"use client";
import React, { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Modal = ({ isOpen, onClose, data }) => {
  const [showDatasets, setShowDatasets] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [addMarkerMode, setAddMarkerMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawnFeatures, setDrawnFeatures] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);

  const draw = useRef(
    new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    })
  );

  useEffect(() => {
    if (mapRef.current && drawMode) {
      const map = mapRef.current.getMap();
      map.addControl(draw.current, "top-left");
      map.on("draw.create", handleDrawCreate);
      map.on("draw.delete", handleDrawDelete);
      map.on("draw.update", handleDrawUpdate);
      map.on("dblclick", preventDoubleClickZoom);
      return () => {
        map.off("draw.create", handleDrawCreate);
        map.off("draw.delete", handleDrawDelete);
        map.off("draw.update", handleDrawUpdate);
        map.off("dblclick", preventDoubleClickZoom);
        map.removeControl(draw.current);
      };
    }
  }, [mapRef, drawMode]);

  const preventDoubleClickZoom = (e) => {
    e.preventDefault();
  };

  const handleDrawCreate = (e) => {
    setDrawnFeatures([...drawnFeatures, e.features[0]]);
  };

  const handleDrawDelete = (e) => {
    setDrawnFeatures(
      drawnFeatures.filter((feature) => feature.id !== e.features[0].id)
    );
  };

  const handleDrawUpdate = (e) => {
    setDrawnFeatures(
      drawnFeatures.map((feature) =>
        feature.id === e.features[0].id ? e.features[0] : feature
      )
    );
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieWFzaHZpLTEyMyIsImEiOiJjbHc4MjdzNDMxbW1hMnRyem9zNWphbHl6In0.FWrh9nJuTu0oM0e20OnRaQ";

  const handleDatasets = () => {
    setShowDatasets(!showDatasets);
  };

  const handleMarker = () => {
    setAddMarkerMode(true);
    setDrawMode(false);
    setMeasureMode(false);
    setMeasurements([]); // Clear previous measurements
  };

  const handleDraw = () => {
    setDrawMode(true);
    setAddMarkerMode(false);
    setMeasureMode(false);
  };

  const handleClose = () => {
    setAddMarkerMode(false);
    setDrawMode(false);
    setMeasureMode(false);
    onClose();
  };

  const handleMapClick = (e) => {
    if (addMarkerMode) {
      const { lng, lat } = e.lngLat;
      setMarkers([...markers, { longitude: lng, latitude: lat }]);
    }
    if (measureMode) {
      const { lng, lat } = e.lngLat;
      const newMeasurement = {
        latitude: lat,
        longitude: lng,
      };
      //it can only measure 2 points at a time if there are more than 2 points it will remove the first point
      if (measurements.length === 2) {
        const updatedMeasurements = measurements.slice(1);
        setMeasurements([...updatedMeasurements, newMeasurement]);
        const dist = calculateDistance(updatedMeasurements[0], newMeasurement);
        setDistance(dist);
      } else {
        setMeasurements([...measurements, newMeasurement]);
        if (measurements.length === 1) {
          const dist = calculateDistance(measurements[0], newMeasurement);
          setDistance(dist);
        }
      }
    }
  };

  const handleMeasure = () => {
    setMeasureMode(true);
    setAddMarkerMode(false);
    setDrawMode(false);
    setMeasurements([]); // Clear previous measurements
  };

  const calculateDistance = (marker1, marker2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (marker2.latitude - marker1.latitude) * (Math.PI / 180);
    const dLon = (marker2.longitude - marker1.longitude) * (Math.PI / 180);
    const lat1 = marker1.latitude * (Math.PI / 180);
    const lat2 = marker2.latitude * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  const updateMeasurement = (index, lng, lat) => {
    const updatedMeasurements = measurements.map((measurement, i) => {
      if (i === index) {
        return { latitude: lat, longitude: lng };
      }
      return measurement;
    });
    setMeasurements(updatedMeasurements);

    if (updatedMeasurements.length === 2) {
      const dist = calculateDistance(
        updatedMeasurements[0],
        updatedMeasurements[1]
      );
      setDistance(dist);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg w-full h-full flex flex-col justify-between">
        <div className="flex justify-end p-2">
          <button onClick={handleClose} className="text-red-500 text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-2 text-black">
          <div className="flex flex-row justify-between flex-wrap">
            <div className="p-2 text-black flex flex-col md:flex-row md:gap-4">
              <button
                className={`border rounded-md p-2 mt-2 md:mt-0 cursor-pointer ${
                  addMarkerMode ? "bg-blue-500 text-white" : ""
                }`}
                onClick={handleMarker}
              >
                Add Marker
              </button>
              <button
                className={`border rounded-md p-2 mt-2 md:mt-0 cursor-pointer  ${
                  drawMode ? "bg-blue-500 text-white" : ""
                }`}
                onClick={handleDraw}
              >
                Draw Shape
              </button>
              <button
                className={`border rounded-md p-2 mt-2 md:mt-0 cursor-pointer ${
                  measureMode ? "bg-blue-500 text-white" : ""
                }`}
                onClick={handleMeasure}
              >
                Measure Distance
              </button>
            </div>
            <div className="p-2 text-black flex justify-end">
              <button
                className="border rounded-md p-2 mt-2 cursor-pointer"
                onClick={handleDatasets}
              >
                {showDatasets ? "Hide Datasets" : "Show Datasets"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-black">
          <div style={{ height: "60vh", width: "60vw" }}>
            <Map
              ref={mapRef}
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "60vw", height: "60vh" }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              onClick={handleMapClick}
              interactiveLayerIds={["point", "drawn-data"]}
            >
              <Source
                id="my-data"
                type="geojson"
                data={
                  showDatasets
                    ? data
                    : { type: "FeatureCollection", features: [] }
                }
              >
                <Layer {...layerStyle} />
              </Source>
              {drawnFeatures.length > 0 && showDatasets && (
                <Source
                  id="drawn-data"
                  type="geojson"
                  data={{
                    type: "FeatureCollection",
                    features: drawnFeatures,
                  }}
                >
                  <Layer
                    id="lineLayer"
                    type="line"
                    source="drawn-data"
                    layout={{
                      "line-join": "round",
                      "line-cap": "round",
                    }}
                    paint={{
                      "line-color": "#000",
                      "line-width": 2,
                    }}
                  />
                </Source>
              )}
              {markers.length > 0 &&
                showDatasets &&
                markers.map((marker, index) => (
                  <Marker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    draggable={true}
                  >
                    <i className="fas fa-map-marker-alt text-2xl text-red-500"></i>
                  </Marker>
                ))}
              {measurements.length > 0 &&
                showDatasets &&
                measurements.map((measurement, index) => (
                  <Marker
                    key={index}
                    latitude={measurement.latitude}
                    longitude={measurement.longitude}
                    draggable={true}
                    onMouseEnter={() => setHoverInfo(measurement)}
                    onDragEnd={(e) => {
                      const { lng, lat } = e.lngLat;
                      updateMeasurement(index, lng, lat);
                    }}
                  >
                    <i className="fas fa-map-marker-alt text-2xl text-green-500"></i>
                  </Marker>
                ))}

              {hoverInfo && (
                <Popup
                  longitude={hoverInfo.lng}
                  latitude={hoverInfo.lat}
                  closeButton={false}
                  anchor="top"
                  offsetTop={10}
                >
                  <div>
                    <p>Longitude: {hoverInfo.lng.toFixed(5)}</p>
                    <p>Latitude: {hoverInfo.lat.toFixed(5)}</p>
                  </div>
                </Popup>
              )}
              {/* )} */}
            </Map>
          </div>
          {distance && <div>Distance: {distance.toFixed(2)} km</div>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
