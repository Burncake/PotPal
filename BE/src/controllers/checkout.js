const cartMethods = require('../models/checkout');
const { db } = require('../config/db');

const addToCart = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        let cart = await cartMethods.getCartByUserID(userID);
        if (!cart) {
            cart = await cartMethods.createCart(userID);
        }

        await cartMethods.validateProductStock(prodID, quantity);

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
        return res.status(200).json({ message: 'Product removed from cart successfully' });
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

const convertCartToOrder = async (req, res) => {
    const { userID, phoneNumber, address, payMethod, note, discountID } = req.body;

    try {
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const cartDetails = await db('cartsDetails').where('cartID', cart.cartID);
        if (cartDetails.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        for (const item of cartDetails) {
            const product = await db('products').where('prodID', item.prodID).first();
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for product ${item.prodID}`
                });
            }
        }

        const [newOrder] = await db('orders')
            .insert({
                cusID: userID,
                phoneNumber,
                address,
                orderStatus: 'Pending',
                createAt: new Date(),
                payMethod,
                orderDate: new Date(),
                totalCost: cartDetails.reduce((sum, item) => sum + item.totalPrice, 0),
                note,
                discountID
            })
            .returning('*');

        for (const item of cartDetails) {
            await db('ordersDetails').insert({
                orderID: newOrder.orderID,
                prodID: item.prodID,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });

            await db('products')
                .where('prodID', item.prodID)
                .decrement('stock', item.quantity);
        }

        await db('cartsDetails').where('cartID', cart.cartID).del();

        return res.status(200).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        return res.status(400).json({ error: `Failed to create order: ${error.message}` });
    }
};

const getAllOrdersByUserID = async (req, res) => {
    const { userID } = req.params;
    try {
        const orders = await db('orders')
            .where('cusID', userID)
            .select('*');

        return res.status(200).json({
            message: 'Orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        return res.status(400).json({ error: `Failed to fetch orders: ${error.message}` });
    }
};

const getAllOrdersForAdmin = async (req, res) => {
    try {
        const orders = await db('orders').select('*');

        return res.status(200).json({
            message: 'All orders retrieved successfully',
            data: orders
        });
    } catch (error) {
        return res.status(400).json({ error: `Failed to fetch orders: ${error.message}` });
    }
};

const getCartByCustomerID = async (req, res) => {
    const { id: customerID } = req.params;

    try {
        const cart = await cartMethods.getCartByUserID(customerID);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the given customer ID.' });
        }

        const cartDetails = await cartMethods.getAllCarts();

        const customerCart = cartDetails.find(item => item.customerID === customerID);

        if (!customerCart) {
            return res.status(404).json({ message: 'Cart details not found for the given customer ID.' });
        }

        res.status(200).json(customerCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart,
    getAllCarts,
    convertCartToOrder,
    getAllOrdersByUserID,
    getAllOrdersForAdmin,
    getCartByCustomerID
};
