"use client";
import { useState } from "react";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const [newPlace, setNewPlace] = useState(null);
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieWFzaHZpLTEyMyIsImEiOiJjbHc4MjdzNDMxbW1hMnRyem9zNWphbHl6In0.FWrh9nJuTu0oM0e20OnRaQ";

  const handleFileUpload = (event) => {
    console.log(event);
  };
  const handleClick = (e) => {
    const data = e.lngLat;
    console.log(data);

    const data1 = {
      long: data.lng,
      lat: data.lat,
    };
    setNewPlace(data1);
  };
  return (
    <main className="min-h-screen p-3">
      <div className="flex justify-between mb-4">
        <img
          src="https://assets-global.website-files.com/660e7952369feece9a6c0e45/661376d0e8d61f1407ad6419_Asset%201.svg"
          width={150}
          height={150}
        />
        <div className="flex flex-row justify-end">
          <div className="mr-3 border rounded-md p-2 cursor-pointer">Login</div>
          <div className="mr-3 border rounded-md p-2 cursor-pointer">
            Signup
          </div>
        </div>
      </div>

      <div className="flex  md:flex-row justify-between mt-10">
        <div className="md:w-2/3 h-[30rem] p-2">
          <ReactMapGl
            mapboxAccessToken={MAPBOX_TOKEN}
            {...viewport}
            // style={{ width: 1000, height: 700 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onDblClick={handleClick}
          >
            {newPlace && (
              <Marker
                latitude={newPlace?.lat}
                longitude={newPlace?.long}
                offsetRight={-7 * viewport.zoom}
                offsetLeft={-3.5 * viewport.zoom}
                draggable
                onDragEnd={(e) =>
                  setNewPlace({ long: e.lngLat.lng, lat: e.lngLat.lat })
                }
              ></Marker>
            )}
            <NavigationControl position="bottom-right" />
          </ReactMapGl>
        </div>
        <div className="flex flex-col justify-center md:w-1/4   lg:pr-14">
          <label
            htmlFor="file-upload"
            className="border rounded-md p-4 text-center text-2xl cursor-pointer"
          >
            <i className="fas fa-upload fa-lg lg:mr-2"></i>Upload File to Render
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
    </main>
  );
}
