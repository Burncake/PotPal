const express = require('express');

const {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart
} = require('../controllers/checkout');

const router = express.Router();

// Route: Thêm sản phẩm vào giỏ hàng
router.put('/cart/add-to-cart', addToCart);
// Route: Xóa sản phẩm khỏi giỏ hàng
router.put('/cart/remove-from-cart', removeFromCart);
// Route: Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/cart/update-cart-quantity', updateCartQuantity);
// Route: Kiểm tra tính hợp lệ của giỏ hàng (kiểm tra số lượng trong kho)
router.get('/cart/validate-cart', validateCart);

module.exports = router;