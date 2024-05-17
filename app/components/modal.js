"use client";
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Modal = ({ isOpen, onClose, data }) => {
  const [showDatasets, setShowDatasets] = useState(true);
  console.log(data);
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
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg w-full h-full flex flex-col justify-between">
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-red-500 text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-2 text-black">
          {/**make 3 buttons  to add marker on map , to draw polygon or any shape on map and a to measure 2 distances on map */}
          <div className="flex flex-row justify-between flex-wrap">
            <div className="p-2 text-black flex flex-col md:flex-row md:gap-4">
              <button className="border rounded-md p-2 mt-2 md:mt-0 cursor-pointer">
                Add Marker
              </button>
              <button className="border rounded-md p-2 mt-2 md:mt-0 cursor-pointer">
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
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
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
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
