import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        username,
        email,
        phone,
      });
      alert(res.data.message);
      navigate("/verify-otp", { state: { email: email } });
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Name"
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegister;
