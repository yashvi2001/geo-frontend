"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";

const login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = {
      useremail: userEmail,
      password: password,
    };

    try {
      const response = await axios.post("https://geo-backend-kxbx.onrender.com/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/";
      } else {
        alert("There was an error logging in! Please try again.");
      }
    } catch (error) {
      alert("There was an error logging in! Please try again.");
    }
  };
  return (
    <>
      <div
        className="p-3 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <img
          src="https://assets-global.website-files.com/660e7952369feece9a6c0e45/661376d0e8d61f1407ad6419_Asset%201.svg"
          width={150}
          height={150}
        />
      </div>
      <div className="flex flex-col justify-center items-center md:mt-32">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-4xl">Login</h1>
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="User Email"
              className="border rounded-md p-4 mt-6 text-black"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded-md p-4 mt-6 text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="border rounded-md p-2 mt-6 cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
            <div className="mt-4">
              <a href="/register" className="text-blue-500">
                Don't have an account? Register
              </a>
            </div>
            <div className="mt-4">
              <a href="/" className="text-blue-500">
                Go back to Home Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
