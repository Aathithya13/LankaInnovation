import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/get-product", {
          withCredentials: true, 
        });

        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit=(id)=>{
    navigate(`/editproduct/${id}`);
  }

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      const res = await axios.delete(`http://localhost:5000/admin/delete-product/${productId}`, {
        withCredentials: true,
      });
  
      alert(res.data.message);
      navigate('/productlist');
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container">
      <h2>Product List</h2>

      
      {loading && <p>Loading products...</p>}

      
      {error && <p style={{ color: "red" }}>{error}</p>}

      
      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={`http://localhost:5000/${product.thumbnail}`}
                alt={product.name}
                className="thumbnail"
              />
              <h3>{product.name}</h3>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Status:</strong> {product.stockStatus}</p>
              <button onClick={()=>{handleEdit(product._id)}}>Edit</button>
              <button onClick={()=>{handleDelete(product._id)}}>Delete</button>
              
              <div className="image-gallery">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${img}`}
                    alt={`Product ${index + 1}`}
                    className="product-image"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
