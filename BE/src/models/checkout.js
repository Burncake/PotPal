const { db } = require('../config/db'); // Ensure db is correctly configured

const cartMethods = {
    getCartByUserID: async (userID) => {
        try {
            return await db('carts')
                .where('cusID', userID)
                .first();
        } catch (error) {
            throw new Error(`Failed to fetch cart: ${error.message}`);
        }
    },

    createCart: async (userID) => {
        try {
            const formattedCartID = userID.padStart(5, '0');
            const [newCart] = await db('carts')
                .insert({ cusID: userID, cartID: formattedCartID })
                .returning('*');
            return newCart;
        } catch (error) {
            throw new Error(`Failed to create cart: ${error.message}`);
        }
    },

    getAllCarts: async () => {
        try {
            const carts = await db('carts').select('cartID', 'cusID', 'createAt');
            const cartsWithDetails = await Promise.all(carts.map(async (cart) => {
                const cartDetails = await db('cartsDetails')
                    .where('cartID', cart.cartID)
                    .select('cartID', 'prodID', 'quantity');
                return {
                    cartID: cart.cartID,
                    customerID: cart.cusID,
                    createAt: cart.createAt,
                    cartsDetail: cartDetails
                };
            }));
            return cartsWithDetails;
        } catch (error) {
            throw new Error(`Failed to fetch all carts: ${error.message}`);
        }
    },

    addProductToCart: async (cartID, prodID, quantity) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error('Insufficient stock');

            const existingProduct = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();

            if (existingProduct) {
                return await db('cartsDetails')
                    .where({ cartID, prodID })
                    .update({
                        quantity: existingProduct.quantity + quantity,
                        totalPrice: (existingProduct.quantity + quantity) * existingProduct.unitPrice
                    });
            } else {
                return await db('cartsDetails')
                    .insert({
                        cartID,
                        prodID,
                        quantity,
                        unitPrice: product.price,
                        totalPrice: quantity * product.price
                    });
            }
        } catch (error) {
            throw new Error(`Failed to add product to cart: ${error.message}`);
        }
    },

    removeProductFromCart: async (cartID, prodID) => {
        try {
            const cartItem = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();
            if (!cartItem) throw new Error(`Product ${prodID} not found in cart`);
            return await db('cartsDetails').where({ cartID, prodID }).del();
        } catch (error) {
            throw new Error(`Failed to remove product from cart: ${error.message}`);
        }
    },

    updateProductQuantityInCart: async (cartID, prodID, quantity) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error('Insufficient stock');

            const existingProduct = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();
            if (!existingProduct) throw new Error('Product not found in cart');

            return await db('cartsDetails')
                .where({ cartID, prodID })
                .update({
                    quantity,
                    totalPrice: quantity * existingProduct.unitPrice
                });
        } catch (error) {
            throw new Error(`Failed to update product quantity: ${error.message}`);
        }
    },

    validateProductStock: async (prodID, quantity) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error(`Insufficient stock for product ${prodID}`);
            return true;
        } catch (error) {
            throw new Error(`Stock validation failed: ${error.message}`);
        }
    },

    checkCartAvailability: async (cartID) => {
        try {
            const cartDetails = await db('cartsDetails').where('cartID', cartID);
            for (const item of cartDetails) {
                const product = await db('products').where('prodID', item.prodID).first();
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.prodID}`);
                }
            }
            return true;
        } catch (error) {
            throw new Error(`Cart validation failed: ${error.message}`);
        }
    }
};

module.exports = cartMethods;
