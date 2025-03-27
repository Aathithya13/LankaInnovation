const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const Product = require("../model/Product");
const verifyUser = require('../middleware/verifyUser');
require('dotenv').config();




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post('/register', async (req, res) => {
  const { username, phone, email } = req.body;
  console.log({username,phone,email});

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

  user = new User({ username, phone, email, otp, otpExpires });
  await user.save();

  
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed to send OTP" });
      
    }
    res.json({ message: "OTP sent to email" });
  });
});


router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || new Date() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.verified = true;
  user.otp = null; 
  user.otpExpires = null;
  await user.save();

  res.json({ message: "OTP verified. Proceed to set password." });
});


router.post('/set-password', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, verified: true });

  if (!user) return res.status(400).json({ message: "User not verified" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password set successfully" });
});

const SECRET_KEY = process.env.SECRET_KEY;


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });

    console.log("User Token Set:", token);
    res.json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
});


router.get("/dashboard", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome to the dashboard!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/get-product", verifyUser, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "Details fetched successfully",
      products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
});












module.exports=router;