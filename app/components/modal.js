"use client";
import React, { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Map, { Source, Layer, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const Modal = ({ isOpen, onClose, data }) => {
  const [showDatasets, setShowDatasets] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [addMarkerMode, setAddMarkerMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [drawnFeatures, setDrawnFeatures] = useState([]);
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
    if (mapRef.current) {
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
    setDrawnFeatures(e.features);
  };

  const handleDrawDelete = (e) => {
    setDrawnFeatures([]);
  };

  const handleDrawUpdate = (e) => {
    setDrawnFeatures(e.features);
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
  };

  const handleDraw = () => {
    setDrawMode(true);
    setAddMarkerMode(false);
    setMeasureMode(false);
  };

  const handleClose = () => {
    setMarkers([]);
    setMeasurements([]);
    setAddMarkerMode(false);
    setDrawMode(false);
    setMeasureMode(false);
    setDrawnFeatures([]);
    onClose();
  };

  const handleMapClick = (e) => {
    if (addMarkerMode) {
      const { lng, lat } = e.lngLat;
      setMarkers([...markers, { longitude: lng, latitude: lat }]);
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
                className="border rounded-md p-2 mt-2 md:mt-0 cursor-pointer"
                onClick={handleMarker}
              >
                Add Marker
              </button>
              <button
                className="border rounded-md p-2 mt-2 md:mt-0 cursor-pointer"
                onClick={handleDraw}
              >
                Draw Shape
              </button>
              <button className="border rounded-md p-2 mt-2 md:mt-0 cursor-pointer">
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
          <div style={{ height: "50vh", width: "50vw" }}>
            <Map
              ref={mapRef}
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              onClick={handleMapClick}
              onDblClick={(e) => e.preventDefault()}
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
              {drawnFeatures.length > 0 && (
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
                markers.map((marker, index) => (
                  <Marker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                  >
                    <i className="fas fa-map-marker-alt text-2xl text-red-500"></i>
                  </Marker>
                ))}
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;