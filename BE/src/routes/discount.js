const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount');

// Route for adding discount
router.post('', discountController.addDiscount);

// Route for updating discount
router.put('', discountController.updateDiscount);

// Route for deleting discount
router.delete(':id', discountController.deleteDiscount);

// Route for getting all discounts
router.get('', discountController.getAllDiscounts);

module.exports = router;
