const db = require('../config/db'); // Giả sử bạn đang dùng knex hoặc sequelize

const cartMethods = {
    getCartByUserID: async (userID) => {
        try {
            return await db('carts')
                .where('cusID', userID)
                .first(); // Trả về giỏ hàng của người dùng (nếu có)
        } catch (error) {
            throw new Error(`Failed to fetch cart: ${error.message}`);
        }
    },

    getCartDetails: async (cartID) => {
        try {
            return await db('cartsDetails')
                .where('cartID', cartID);
        } catch (error) {
            throw new Error(`Failed to fetch cart details: ${error.message}`);
        }
    },

    addProductToCart: async (cartID, prodID, quantity) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error(`Insufficient stock for product ${prodID}`);

            const existingProduct = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();

            if (existingProduct) {
                const newQuantity = existingProduct.quantity + quantity;
                if (product.stock < newQuantity) {
                    throw new Error(`Insufficient stock for product ${prodID} with requested quantity`);
                }

                return await db('cartsDetails')
                    .where({ cartID, prodID })
                    .update({
                        quantity: newQuantity,
                        totalPrice: newQuantity * existingProduct.unitPrice
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

            const result = await db('cartsDetails')
                .where({ cartID, prodID })
                .del();

            return result;
        } catch (error) {
            throw new Error(`Failed to remove product from cart: ${error.message}`);
        }
    },

    updateProductQuantityInCart: async (cartID, prodID, quantity) => {
        try {
            // Kiểm tra số lượng sản phẩm trong kho
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error('Insufficient stock for this product');

            const existingProduct = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();
            if (!existingProduct) throw new Error('Product not found in cart');

            // Cập nhật số lượng và tổng giá trị sản phẩm
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
            const cartDetails = await db('cartsDetails')
                .where('cartID', cartID);
            for (const item of cartDetails) {
                const product = await db('products')
                    .where('prodID', item.prodID)
                    .first();
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.prodID}`);
                }
            }
            return true;
        } catch (error) {
            throw new Error(`Cart validation failed: ${error.message}`);
        }
    },
}

module.exports = cartMethods;


