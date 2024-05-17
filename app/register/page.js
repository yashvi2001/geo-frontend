"use client";
import { useState } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Register = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!userEmail || !password) {
      alert("Please fill in all fields!");
      return;
    }
    //write a validation function here to check if the email is valid
    const emailValidation = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };
    if (!emailValidation(userEmail)) {
      alert("Please enter a valid email address!");
      return;
    }

    const data = {
      useremail: userEmail,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:8000/register", data);
      if (response.status === 200) {
        alert("Registration successful!");
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/";
      } else {
        alert(
          "There was an error registering! IF User already exists, please login."
        );
      }
    } catch (error) {
      alert(
        "There was an error registering! IF User already exists, please login."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl">Register</h1>
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
            onClick={handleRegister}
          >
            Register
          </button>

          <div className="mt-4">
            <a href="/login" className="text-blue-500">
              Already have an account? Login
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
  );
};

export default Register;
