const express = require('express');
const router = express.Router();
const Admin = require('../model/Admin');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const verifyAdmin = require('../middleware/verifyAdmin');
const Product = require('../model/Product');
const mongoose = require('mongoose');

const SECRET_KEY = process.env.SECRET_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "Upload/Images"); 
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
  { name: 'images', maxCount: 5 },   
  { name: 'thumbnail', maxCount: 1 } 
]);


router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin || !(await bcrypt.compare(password, admin.password)))
        return res.status(401).json({ message: "Invalid Credentials" });
  
      const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
      res.cookie("adminToken", token, { httpOnly: true });
      res.json({ message: "Admin logged in successfully",token});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

router.get("/dashboard", verifyAdmin, async(req, res) => {
  console.log(req.admin);
  try{
    const admin = await Admin.findById(req.admin.id);
    res.json({ message: "Welcome Admin",data:req.admin,admin});
  }
  catch(err){
    res.status(401).json({message:err});
  }
});



router.post('/add-product', upload, verifyAdmin,async (req, res) => {
    try {
        const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const thumbnailPath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

        const { name, brand, price, shortDescription, detailedDescription, stockStatus } = req.body;

        
        const newProduct = new Product({
            name,
            brand,
            price,
            shortDescription,
            detailedDescription,
            stockStatus,
            images: imagePaths,    
            thumbnail: thumbnailPath 
        });

        
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/get-product', verifyAdmin, async (req, res) => {
  try {
      const products = await Product.find();

      if (!products || products.length === 0) {
          return res.status(404).json({ message: "No products found" });
      }

      res.status(200).json({
          message: "Products fetched successfully",
          products: products
      });

  } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.put('/edit-product/:id', verifyAdmin, async (req, res) => {
  try {
      const { name, brand, price, shortDescription, detailedDescription, stockStatus } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { name, brand, price, shortDescription, detailedDescription, stockStatus }, // Only update text fields
          { new: true, runValidators: true } // Return updated product & apply validations
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product", error: error.message });
  }
});


router.get("/get-product/:id",verifyAdmin,async(req,res)=>{
  try {
    const {id} = req.params;

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product Fetched successfully", product:product });
  } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});


router.delete("/delete-product/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



  
module.exports=router;
