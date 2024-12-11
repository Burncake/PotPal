const { cartMethods } = require('../models/checkout');
const db = require('../config/db'); // Giả sử bạn có đối tượng db để kết nối với cơ sở dữ liệu

const addToCart = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        // Lấy giỏ hàng của người dùng
        let cart = await cartMethods.getCartByUserID(userID);
        if (!cart) {
            // Nếu chưa có giỏ hàng thì tạo mới
            cart = await db('carts').insert({ cusID: userID }).returning('*');
        }

        // Thêm sản phẩm vào giỏ hàng
        await cartMethods.addProductToCart(cart.cartID, prodID, quantity);
        return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { userID, prodID } = req.body;
    try {
        // Lấy giỏ hàng của người dùng
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Xóa sản phẩm khỏi giỏ hàng
        await cartMethods.removeProductFromCart(cart.cartID, prodID);
        return res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateCartQuantity = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        // Lấy giỏ hàng của người dùng
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        await cartMethods.updateProductQuantityInCart(cart.cartID, prodID, quantity);
        return res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const validateCart = async (req, res) => {
    const { userID } = req.body;
    try {
        // Lấy giỏ hàng của người dùng
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Kiểm tra tính hợp lệ của giỏ hàng (số lượng trong kho)
        await cartMethods.checkCartAvailability(cart.cartID);
        return res.status(200).json({ message: 'Cart is valid' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart
};
