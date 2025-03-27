const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    images: [{ type: String, required: true }], 
    thumbnail: { type: String, required: true }, 
    price: { type: String, required: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    stockStatus: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock', 'Limited Stock'], 
        default: 'In Stock' 
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
