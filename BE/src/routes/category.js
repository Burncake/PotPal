// src/routes/category.js
const express = require('express');

const {
    getAllRootCategories,
    getCategoryByCatId,
    getAllChildrenCategoriesByCatID,
    getCategoryTree
} = require('../controllers/category');

const router = express.Router();

// Endpoint: Lấy tất cả sản phẩm
router.get('/roots/all', getAllRootCategories);
router.get('/roots/:id', getAllRootCategories);
router.get('/child/:id', getAllChildrenCategoriesByCatID);
router.get('/tree', getCategoryTree);
router.get('/detail/:id', getCategoryByCatId);

module.exports = router;