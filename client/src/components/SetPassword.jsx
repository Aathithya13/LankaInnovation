import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/user/set-password", { email, password });
      alert("Password set successfully!");
      navigate("/userlogin");
    } catch (error) {
      alert("Error setting password!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Set Password</button>
    </form>
  );
};

export default SetPassword;
