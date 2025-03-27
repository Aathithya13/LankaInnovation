import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // To get product ID from URL

const EditProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    shortDescription: "",
    detailedDescription: "",
    stockStatus: "",
  });
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/get-product/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          console.error("Invalid response structure:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);
  

  
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/edit-product/${id}`,
        product, 
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate("/productlist"), 2000); // Redirect after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating product");
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" required />
        <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" required />
        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required />
        <textarea name="shortDescription" value={product.shortDescription} onChange={handleChange} placeholder="Short Description" required />
        <textarea name="detailedDescription" value={product.detailedDescription} onChange={handleChange} placeholder="Detailed Description" required />
        <select name="stockStatus" value={product.stockStatus} onChange={handleChange} required>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <button type="submit">Update Product</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default EditProduct;
