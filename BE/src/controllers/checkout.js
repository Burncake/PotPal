const cartMethods = require('../models/checkout');


const addToCart = async (req, res) => {
    const { userID, prodID, quantity } = req.body;
    try {
        let cart = await cartMethods.getCartByUserID(userID);
        if (!cart) {
            cart = await cartMethods.createCart(userID);
        }

        // Check inventory
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
        // Lấy Cart của người dùng
        const cart = await cartMethods.getCartByUserID(userID);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Lấy danh sách sản phẩm trong Cart
        const cartDetails = await db('cartsDetails').where('cartID', cart.cartID);
        if (cartDetails.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        // Kiểm tra tồn kho cho từng sản phẩm
        for (const item of cartDetails) {
            const product = await db('products').where('prodID', item.prodID).first();
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for product ${item.prodID}`
                });
            }
        }

        // Tạo đơn hàng mới
        const [newOrder] = await db('orders')
            .insert({
                cusID: userID,
                phoneNumber,
                address,
                orderStatus: 'Pending', // Trạng thái mặc định
                createAt: new Date(),
                payMethod,
                orderDate: new Date(),
                totalCost: cartDetails.reduce((sum, item) => sum + item.totalPrice, 0),
                note,
                discountID
            })
            .returning('*');

        // Chuyển sản phẩm từ Cart sang OrderDetails
        for (const item of cartDetails) {
            await db('ordersDetails').insert({
                orderID: newOrder.orderID,
                prodID: item.prodID,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            });

            // Cập nhật tồn kho
            await db('products')
                .where('prodID', item.prodID)
                .decrement('stock', item.quantity);
        }

        // Xóa sản phẩm trong Cart
        await db('cartsDetails').where('cartID', cart.cartID).del();

        return res.status(200).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        return res.status(400).json({ error: `Failed to create order: ${error.message}` });
    }
};



module.exports = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    validateCart,
    getAllCarts,
    convertCartToOrder
};
