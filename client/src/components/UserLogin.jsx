import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/user/login",
        { email, password },
        { withCredentials: true } // Ensures cookies are sent with the request
      );

      setMessage(res.data.message);
      navigate("/userdashboard"); // Redirect on successful login
    } catch (err) {
      console.error("Login Error:", err.response);
      setMessage(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default UserLogin;
