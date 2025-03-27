import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashBoard = () => {
  const [admin, setAdmin] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/dashboard", {
          withCredentials: true, // Ensures the cookie is sent
        });

        setAdmin(res.data.admin);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Unauthorized");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {admin ? (
        <div>
          <p>{message}</p>
          <p>Username: {admin.username}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashBoard;
