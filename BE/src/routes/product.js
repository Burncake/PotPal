// src/routes/product.js
const express = require('express');
const { getProducts, getProduct } = require('../controllers/product');

const router = express.Router();

// Endpoint: Lấy tất cả sản phẩm
router.get('/', getProducts);

// Endpoint: Lấy sản phẩm theo ID
router.get('/:id', getProduct);

module.exports = router;
