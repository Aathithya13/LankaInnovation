import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/get-product", {
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

export default UserProducts;
