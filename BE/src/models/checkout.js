// models/CartModel.js
const db = require('../config/db'); // Giả sử bạn đang dùng knex hoặc sequelize

class cartMethods {
    static async getCartByUserID(userID) {
        try {
            return await db('carts')
                .where('cusID', userID)
                .first(); // Trả về giỏ hàng của người dùng (nếu có)
        } catch (error) {
            throw new Error(`Failed to fetch cart: ${error.message}`);
        }
    }

    static async getCartDetails(cartID) {
        try {
            return await db('cartsDetails')
                .where('cartID', cartID);
        } catch (error) {
            throw new Error(`Failed to fetch cart details: ${error.message}`);
        }
    }

    static async addProductToCart(cartID, prodID, quantity) {
        try {
            // Kiểm tra sản phẩm có tồn tại và còn đủ số lượng
            const product = await db('products').where('prodID', prodID).first();
            if (!product) throw new Error(`Product with ID ${prodID} not found`);
            if (product.stock < quantity) throw new Error('Insufficient stock for this product');

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingProduct = await db('cartsDetails')
                .where({ cartID, prodID })
                .first();

            if (existingProduct) {
                // Nếu đã có thì tăng số lượng lên
                return await db('cartsDetails')
                    .where({ cartID, prodID })
                    .update({
                        quantity: existingProduct.quantity + quantity,
                        totalPrice: (existingProduct.quantity + quantity) * existingProduct.unitPrice
                    });
            } else {
                // Nếu chưa có thì thêm mới
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
    }

    static async removeProductFromCart(cartID, prodID) {
        try {
            const result = await db('cartsDetails')
                .where({ cartID, prodID })
                .del();
            return result;
        } catch (error) {
            throw new Error(`Failed to remove product from cart: ${error.message}`);
        }
    }

    static async updateProductQuantityInCart(cartID, prodID, quantity) {
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
    }

    static async checkCartAvailability(cartID) {
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
    }
}

module.exports = cartMethods;
