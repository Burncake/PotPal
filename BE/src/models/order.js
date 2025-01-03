const {db} = require('../config/db');

// WARNING: DONT TOUCH !!!!
const orderMethods = {
    // 1. Thêm mới một Order
    addOrder: async (OrderData) => {
        try {
            const { prodID, OrderPercent, startDate, endDate } = OrderData;

            // Kiểm tra dữ liệu đầu vào
            if (!prodID || !OrderPercent || !startDate || !endDate) {
                throw new Error('Missing required fields: prodID, OrderPercent, startDate, endDate');
            }

            await db('Orders').insert({
                prodID,
                OrderPercent,
                startDate,
                endDate,
            });

            return { message: 'Order added successfully.' };
        } catch (error) {
            throw new Error(`Failed to add Order: ${error.message}`);
        }
    },

    // 2. Cập nhật Order dựa trên OrderID
    updateOrder: async (OrderID, updateData) => {
        try {
            const { OrderPercent, startDate, endDate } = updateData;

            const updateFields = {};
            if (OrderPercent !== undefined) updateFields.OrderPercent = OrderPercent;
            if (startDate !== undefined) updateFields.startDate = startDate;
            if (endDate !== undefined) updateFields.endDate = endDate;

            const updated = await db('Orders')
                .where('OrderID', OrderID)
                .update(updateFields);

            if (!updated) {
                throw new Error(`Order with ID ${OrderID} not found.`);
            }

            return { message: 'Order updated successfully.' };
        } catch (error) {
            throw new Error(`Failed to update Order: ${error.message}`);
        }
    },

    // 3. Xóa Order dựa trên OrderID
    deleteOrder: async (OrderID) => {
        try {
            const deleted = await db('Orders').where('OrderID', OrderID).del();

            if (!deleted) {
                throw new Error(`Order with ID ${OrderID} not found.`);
            }

            return { message: 'Order deleted successfully.' };
        } catch (error) {
            throw new Error(`Failed to delete Order: ${error.message}`);
        }
    },

    // 4. Lấy thông tin Order dựa trên OrderID
    getOrderByID: async (OrderID) => {
        try {
            const Order = await db('Orders').where('OrderID', OrderID).first();

            if (!Order) {
                throw new Error(`Order with ID ${OrderID} not found.`);
            }

            return Order;
        } catch (error) {
            throw new Error(`Failed to fetch Order: ${error.message}`);
        }
    },

    // 5. Lấy giá giảm cho 1 sản phẩm
    getOrderedPrice: async (prodID) => {
        try {
            const product = await db('products').where('prodID', prodID).first();
            if (!product) {
                throw new Error(`Product with ID ${prodID} not found`);
            }

            const Order = await db('Orders')
                .select('OrderPercent')
                .where('prodID', prodID)
                .andWhere('startDate', '<=', db.fn.now())
                .andWhere('endDate', '>=', db.fn.now())
                .orderBy('OrderPercent', 'desc')
                .first();

            const OrderPercent = Order ? Order.OrderPercent : 0;
            const OrderedPrice = product.price * (1 - OrderPercent / 100);

            return {
                prodID: product.prodID,
                prodName: product.prodName,
                originalPrice: product.price,
                OrderPercent,
                OrderedPrice: parseFloat(OrderedPrice.toFixed(2)),
            };
        } catch (error) {
            throw new Error(`Failed to calculate Ordered price: ${error.message}`);
        }
    },

    // 6. Lấy tất cả các Order hiện tại
    getAllOrders: async () => {
        try {
            const Orders = await db('Orders').select('*');
            return Orders;
        } catch (error) {
            throw new Error(`Failed to fetch Orders: ${error.message}`);
        }
    },
};

module.exports = orderMethods;
