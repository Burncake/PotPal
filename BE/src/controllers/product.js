// src/controllers/product.js
const { getAllProducts, getProductById } = require('../models/product');

// Lấy tất cả sản phẩm
function getProducts(req, res) {
    const products = getAllProducts();
    res.status(200).json(products);
}

// Lấy sản phẩm theo ID
function getProduct(req, res) {
    const id = parseInt(req.params.id, 10);
    const product = getProductById(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
}

module.exports = { getProducts, getProduct };
