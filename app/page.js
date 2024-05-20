"use client";
import { useEffect, useState, useRef } from "react";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Modal from "./components/modal";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-122.4, 37.8] },
      },
    ],
  });
  const [geojson, setgeojson] = useState(null);
  const [showData, setShowData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoieWFzaHZpLTEyMyIsImEiOiJjbHc4MjdzNDMxbW1hMnRyem9zNWphbHl6In0.FWrh9nJuTu0oM0e20OnRaQ";

  const handleFileUpload = async (event) => {
    setUploading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("useremail", userDetails.useremail);
    try {
      const response = await axios.post(
        "https://geo-backend-kxbx.onrender.com/upload",
        formData
      );

      if (response.status === 200) {
        setUploadedData(response.data);
        setUploading(false);
        alert("File uploaded successfully");
      } else {
        alert("There was an error uploading the file");
      }
    } catch (error) {
      alert("There was an error uploading the file");
    }
  };
  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };
  const data = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [-122.4, 37.8] },
      },
    ],
  };
  useEffect(() => {
    if (!userDetails) return;
    try {
      const fetchData = async () => {
        const response = await axios.get(
          "https://geo-backend-kxbx.onrender.com/data?useremail=" +
            userDetails.useremail
        );
        setgeojson(response.data);
      };

      fetchData();
    } catch (error) {
      alert("There was an error fetching the data ! Please try again.");
    }
  }, [userDetails, uploadedData]);
  //get the user data from local storage and check if the user is logged in
  useEffect(() => {
    setLoading(true);
    const user = localStorage.getItem("user");
    if (user) {
      const userJson = JSON.parse(user);
      setUserDetails(userJson);
      setLoading(false);
      setShowData(true);
    } else {
      setLoading(false);
      setShowData(false);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserDetails(null);
    window.location.href = "/";
  };

  const handleModal = (data) => {
    setOpenModal(true);
    setModalData(data);
  };

  return (
    <main className="min-h-screen p-3">
      <Modal
        data={modalData}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
      {showData !== null && !loading && (
        <div>
          <nav>
            <div className="flex justify-between mb-4">
              <div
                className="cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                <img
                  src="https://assets-global.website-files.com/660e7952369feece9a6c0e45/661376d0e8d61f1407ad6419_Asset%201.svg"
                  width={150}
                  height={150}
                />
              </div>
              {userDetails?.useremail ? (
                <div className="flex flex-row justify-end">
                  <div className="mr-3 mt-2 sm:hidden md:block">
                    {userDetails.useremail}
                  </div>
                  <div
                    className="mr-3 border rounded-md p-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-end">
                  <div
                    className="mr-3 border rounded-md p-2 cursor-pointer"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Login
                  </div>
                  <div
                    className="mr-3 border rounded-md p-2 cursor-pointer"
                    onClick={() => (window.location.href = "/register")}
                  >
                    Signup
                  </div>
                </div>
              )}
            </div>
          </nav>
          {!showData && (
            <div>
              <div className="flex justify-center relative top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[50%]">
                <div className="flex flex-col justify-center ">
                  <h1 className="text-4xl font-bold">Welcome to Maps</h1>
                  <p className="text-lg">
                    Upload the file to render the map and make it interactive
                  </p>

                  <button
                    className="border rounded-md p-2 mt-6 cursor-pointer"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
              <div className="flex justify-center pt-32">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0d/WorldMap.svg"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          )}

          {showData && (
            <div>
              <div className="flex  md:flex-row justify-center mt-10">
                <div className="flex flex-col justify-center items-center   lg:pr-14">
                  <label
                    htmlFor="file-upload"
                    className="border rounded-md p-4 text-center text-2xl cursor-pointer"
                  >
                    <i className="fas fa-upload fa-lg lg:mr-2"></i>Upload File
                    to Render
                    <input
                      id="file-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </label>
                  {uploading && (
                    <div className="mt-2">Uploading the file...</div>
                  )}
                </div>
              </div>
              {!openModal && (
                <div>
                  <div className="flex flex-col justify-center items-center pt-12">
                    An Example of a map and data that is uploaded
                  </div>
                  <div className="flex justify-center mt-3">
                    <div className="flex flex-col justify-center items-center border rounded-md p-4">
                      <div style={{ height: "50vh", width: "50vw" }}>
                        <Map
                          mapboxAccessToken={MAPBOX_TOKEN}
                          style={{ width: "100%", height: "100%" }}
                          mapStyle="mapbox://styles/mapbox/streets-v9"
                        >
                          <Source id="my-data" type="geojson" data={data}>
                            <Layer {...layerStyle} />
                          </Source>
                        </Map>
                      </div>
                      <div
                        className="text-xl font-bold mt-2 border-2 p-2 rounded-md cursor-pointer"
                        onClick={() => handleModal(data)}
                      >
                        View detailed data
                      </div>
                    </div>
                  </div>
                  {
                    <div className="flex justify-center mt-10">
                      <div className="flex flex-col justify-center items-center">
                        All the data will be displayed here that is uploaded
                      </div>
                    </div>
                  }
                  <div className="flex flex-wrap justify-center">
                    {geojson?.map((data1, index) => {
                      return (
                        <div>
                          {data1.data.type != "Buffer" ? (
                            <div
                              key={index}
                              className="flex flex-row justify-center mt-6 ml-5 items-center flex-wrap"
                            >
                              <div className="flex flex-col justify-center items-center border rounded-md p-4">
                                <div style={{ height: "20vh", width: "20vw" }}>
                                  <Map
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    style={{ width: "100%", height: "100%" }}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                  >
                                    <Source
                                      id="my-data"
                                      type="geojson"
                                      data={data1.data}
                                    >
                                      <Layer {...layerStyle} />
                                    </Source>
                                  </Map>
                                </div>
                                <div
                                  className="text-xl font-bold mt-2 border-2 p-2 rounded-md cursor-pointer"
                                  onClick={() => handleModal(data1.data)}
                                >
                                  View detailed data
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={index}
                              className="flex flex-row justify-center mt-6 ml-5 items-center flex-wrap"
                            >
                              <div className="flex flex-col justify-center items-center border rounded-md p-4">
                                <div style={{ height: "20vh", width: "20vw" }}>
                                  <Map
                                    mapboxAccessToken={MAPBOX_TOKEN}
                                    style={{ width: "100%", height: "100%" }}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                  >
                                    <img
                                      src={`data:image/tiff;base64,${Buffer.from(
                                        data1.data
                                      ).toString("base64")}`}
                                      alt="Tiff"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                      }}
                                    />
                                  </Map>
                                </div>
                                <div
                                  className="text-xl font-bold mt-2 border-2 p-2 rounded-md cursor-pointer"
                                  onClick={() => handleModal(data1.data)}
                                >
                                  View detailed data
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
