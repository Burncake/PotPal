const express = require('express');

const {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart,
    getAllCarts,
    convertCartToOrder
} = require('../controllers/checkout');

const router = express.Router();

/// Route: Add product to cart
router.put('/cart/items/add', addToCart);

// Route: Remove product from cart
router.put('/cart/items/remove', removeFromCart);

// Route: Update product quantity in cart
router.put('/cart/items/update-quantity', updateCartQuantity);

router.get('/cart/all', getAllCarts);

// Route: Validate cart (check stock availability)
router.get('/cart/items/validate', validateCart);

// Route: Convert Cart to Order
router.post('/cart/checkout', convertCartToOrder);

module.exports = router;