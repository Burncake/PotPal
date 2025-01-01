// src/routes/product.js
const express = require('express');

const {
    getAllProducts,
    getProductByID,
    getDetailProductByProdID,
    getRelatedProductsByProID,
    getProductsByCatID
} = require('../controllers/product');

const router = express.Router();

router.get('/general/all', getAllProducts);
router.get('/general/:id', getProductByID);
router.get('/detail/:id', getDetailProductByProdID);
router.get('/related/:id', getRelatedProductsByProID);
router.get('/category/:id', getProductsByCatID);

router.get('/search/', );
router.post('/add/', );
router.post('/update/', );
router.post('/remove/', );

module.exports = router;
