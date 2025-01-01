const cartMethods = require('../models/checkout');


const addToCart = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        let cart = await cartMethods.getCartByUserID(userID);
        if (!cart) {
            // If cart does not exist, create a new cart for the user
            cart = await cartMethods.createCart(userID);
        }

        await cartMethods.addProductToCart(cart.cartID, prodID, quantity);
        return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


const removeFromCart = async (req, res) => {
    const { userID, prodID } = req.body;
    try {
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        await cartMethods.removeProductFromCart(cart.cartID, prodID);
        return res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const updateCartQuantity = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        await cartMethods.updateProductQuantityInCart(cart.cartID, prodID, quantity);
        return res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const validateCart = async (req, res) => {
    const { userID } = req.body;
    try {
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        await cartMethods.checkCartAvailability(cart.cartID);
        return res.status(200).json({ message: 'Cart is valid' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartMethods.getAllCarts();
        return res.status(200).json({
            message: 'All carts retrieved successfully',
            data: carts
        });
    } catch (error) {
        return res.status(400).json({
            error: `Failed to fetch carts: ${error.message}`
        });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart,
    getAllCarts
};
