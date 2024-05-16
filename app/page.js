"use client";
import { useEffect, useState } from "react";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  const [newPlace, setNewPlace] = useState(null);
  const [geojson, setgeojson] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [popup, setPopup] = useState({ lat: null, lng: null });
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieWFzaHZpLTEyMyIsImEiOiJjbHc4MjdzNDMxbW1hMnRyem9zNWphbHl6In0.FWrh9nJuTu0oM0e20OnRaQ";

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:8000/upload", formData);
    console.log(response);

    // if (event.target.files[0].name.includes(".geojson")) {
    //   const newFileReader = new FileReader();
    //   newFileReader.readAsDataURL(event.target.files[0]);
    //   newFileReader.onload = (e) => {
    //     let data = e.target.result;
    //     setgeojson(data);

    //     //upload data to server

    //     const data1 = {
    //       file: data,
    //       name: event.target.files[0].name,
    //     };

    //     fetch("http://localhost:8000/upload", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(data1),
    //     })
    //       .then((res) => res.json())
    //       .then((data) => {
    //         console.log(data);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   };

    //   newFileReader.onerror = (e) => {
    //     console.log("Error", e.target.error);
    //   };
    // }

    // if (event.target.files[0].name.includes(".kml")) {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = function (e) {
    //     const parser = new DOMParser();
    //     const xml = parser.parseFromString(e.target.result, "text/xml");
    //     const geojson = toGeoJSON.kml(xml);
    //     console.log(geojson);

    //     setgeojson(geojson);
    //   };

    //   reader.readAsText(file);
    // }
    // if (event.target.files[0].name.includes(".tiff")) {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = function (e) {
    //     const tiff = fromArrayBuffer(e.target.result);
    //     console.log(tiff);
    //   };
    // }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/data");
      console.log(response.data, "response");
      // setgeojson(response.data);
    };
    fetchData();
  }, []);
  const handleClick = (e) => {
    const data = e.lngLat;
    console.log(data);

    const data1 = {
      long: data.lng,
      lat: data.lat,
    };
    setNewPlace(data1);
  };
  // const geojson = {
  //   type: 'FeatureCollection',
  //   features: [
  //     {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}}
  //   ]
  // };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };
  console.log(popup);
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
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            mapLib={import("mapbox-gl")}
            // initialViewState={{
            //   longitude: -122.4,
            //   latitude: 37.8,
            //   zoom: 14
            // }}
            // onClick={(e) => setMarkers([...markers, e.lngLat])}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {geojson && (
              <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
              </Source>
            )}
            {markers?.map((data, index) => {
              return (
                <Marker
                  onClick={(e) => {
                    setPopup(data);
                  }}
                  key={index}
                  latitude={data.lat}
                  longitude={data.lng}
                />
              );
            })}
            {popup.lat != null && (
              <Popup latitude={popup.lat} longitude={popup.lat}>
                this is pop
              </Popup>
            )}{" "}
          </Map>
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
