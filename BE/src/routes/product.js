const express = require('express');
const {
    getAllProducts,
    getProductByID,
    getDetailProductByProdID,
    getRelatedProductsByProID,
    getProductsByCatID,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');

const router = express.Router();

router.get('/general/all', getAllProducts);
router.get('/general/:id', getProductByID);
router.get('/detail/:id', getDetailProductByProdID);
router.get('/related/:id', getRelatedProductsByProID);
router.get('/category/:id', getProductsByCatID);

router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/remove/:id', deleteProduct);

module.exports = router;
