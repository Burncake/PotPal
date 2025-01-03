const {db} = require('../config/db'); // Kết nối database

const discountMethods = {
    // 1. Thêm mới một discount
    addDiscount: async (discountData) => {
        try {
            const { prodID, discountPercent, startDate, endDate } = discountData;

            // Kiểm tra dữ liệu đầu vào
            if (!prodID || !discountPercent || !startDate || !endDate) {
                throw new Error('Missing required fields: prodID, discountPercent, startDate, endDate');
            }

            await db('discounts').insert({
                prodID,
                discountPercent,
                startDate,
                endDate,
            });

            return { message: 'Discount added successfully.' };
        } catch (error) {
            throw new Error(`Failed to add discount: ${error.message}`);
        }
    },

    // 2. Cập nhật discount dựa trên discountID
    updateDiscount: async (discountID, updateData) => {
        try {
            const { discountPercent, startDate, endDate } = updateData;

            const updateFields = {};
            if (discountPercent !== undefined) updateFields.discountPercent = discountPercent;
            if (startDate !== undefined) updateFields.startDate = startDate;
            if (endDate !== undefined) updateFields.endDate = endDate;

            const updated = await db('discounts')
                .where('discountID', discountID)
                .update(updateFields);

            if (!updated) {
                throw new Error(`Discount with ID ${discountID} not found.`);
            }

            return { message: 'Discount updated successfully.' };
        } catch (error) {
            throw new Error(`Failed to update discount: ${error.message}`);
        }
    },

    // 3. Xóa discount dựa trên discountID
    deleteDiscount: async (discountID) => {
        try {
            const deleted = await db('discounts').where('discountID', discountID).del();

            if (!deleted) {
                throw new Error(`Discount with ID ${discountID} not found.`);
            }

            return { message: 'Discount deleted successfully.' };
        } catch (error) {
            throw new Error(`Failed to delete discount: ${error.message}`);
        }
    },

    // 4. Lấy thông tin discount dựa trên discountID
    getDiscountByID: async (discountID) => {
        try {
            const discount = await db('discounts').where('discountID', discountID).first();

            if (!discount) {
                throw new Error(`Discount with ID ${discountID} not found.`);
            }

            return discount;
        } catch (error) {
            throw new Error(`Failed to fetch discount: ${error.message}`);
        }
    },

    // 5. Lấy giá giảm cho 1 sản phẩm
    getDiscountedPrice: async (prodID) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) {
                throw new Error(`Product with ID ${prodID} not found`);
            }

            const discount = await db('discounts')
                .select('discountPercent')
                .where('prodID', prodID)
                .andWhere('startDate', '<=', db.fn.now())
                .andWhere('endDate', '>=', db.fn.now())
                .orderBy('discountPercent', 'desc')
                .first();

            const discountPercent = discount ? discount.discountPercent : 0;
            const discountedPrice = product.price * (1 - discountPercent / 100);

            return {
                prodID: product.prodID,
                prodName: product.prodName,
                originalPrice: product.price,
                discountPercent,
                discountedPrice: parseFloat(discountedPrice.toFixed(2)),
            };
        } catch (error) {
            throw new Error(`Failed to calculate discounted price: ${error.message}`);
        }
    },

    // 6. Lấy tất cả các discount hiện tại
    getAllDiscounts: async () => {
        try {
            const discounts = await db('discounts').select('*');
            return discounts;
        } catch (error) {
            throw new Error(`Failed to fetch discounts: ${error.message}`);
        }
    },
};

module.exports = discountMethods;
