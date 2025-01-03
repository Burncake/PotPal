const express = require("express");

const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  validateCart,
  getAllCarts,
  convertCartToOrder,
  getAllOrdersByUserID,
  getAllOrdersForAdmin,
  getCartByCustomerID,
} = require("../controllers/checkout");

const router = express.Router();

router.put("/cart/items/add", addToCart);
router.put("/cart/items/remove", removeFromCart);
router.put("/cart/items/update-quantity", updateCartQuantity);
router.get("/cart/customer/:id", getCartByCustomerID);
router.get("/cart/all", getAllCarts);
router.get("/cart/items/validate", validateCart);
router.post("/cart/checkout", convertCartToOrder);

module.exports = router;
