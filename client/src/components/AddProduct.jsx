import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        price: "",
        shortDescription: "",
        detailedDescription: "",
        stockStatus: "In Stock",
    });

    const [images, setImages] = useState([]);  
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        setImages((prevImages) => [...prevImages, ...selectedFiles]); 
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length > 5) {
            alert("Only 5 images are allowed!");
            return;
        }

        const formData = new FormData();

        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]); // Append multiple images
        }

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]); 
        }

        try {
            const res = await axios.post("http://localhost:5000/admin/add-product", formData, {
                withCredentials:true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(res.data.message);
            setProduct({
                name: "",
                brand: "",
                price: "",
                shortDescription: "",
                detailedDescription: "",
                stockStatus: "In Stock",
            });
            setImages([]);
            setThumbnail(null);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to add product");
        }
    };

    return (
        <div>
            <h2>Add Product</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleInputChange} required />
                <input type="text" name="brand" placeholder="Brand" value={product.brand} onChange={handleInputChange} required />
                <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleInputChange} required />
                <textarea name="shortDescription" placeholder="Short Description" value={product.shortDescription} onChange={handleInputChange} required />
                <textarea name="detailedDescription" placeholder="Detailed Description" value={product.detailedDescription} onChange={handleInputChange} required />
                <select name="stockStatus" value={product.stockStatus} onChange={handleInputChange}>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>

                <label>Upload Images (Max: 5)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />

                <label>Upload Thumbnail (Single)</label>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} />

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
