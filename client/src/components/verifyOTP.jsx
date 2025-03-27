import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", { email, otp });
      alert(res.data.message);
      navigate("/set-password", { state: { email } }); 
    } catch (error) {
      alert("Invalid OTP!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOTP;
