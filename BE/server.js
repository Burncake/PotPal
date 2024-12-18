const express = require('express');
const multer = require('multer');
const cloudinary = require('./cloudinary');
const upload = multer({ dest: 'uploads/' }); // Thư mục tạm
const bodyParser = require('body-parser');

const { db, checkDbConnection } = require('./src/config/db');

require('dotenv').config();

const productRoutes = require('./src/routes/product');
const accountRoutes = require('./src/routes/account');
const categoryRoutes = require('./src/routes/category');
const checkoutRoutes = require('./src/routes/checkout');
const discountRoutes = require('./src/routes/discount');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Backend!');
});

app.use('/product', productRoutes);
app.use('/account', accountRoutes);
app.use('/category', categoryRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/discount', discountRoutes);


// Kiểm tra kết nối cơ sở dữ liệu và sau đó khởi động server
const startServer = async () => {
    try {
        // Kiểm tra kết nối cơ sở dữ liệu
        await checkDbConnection();
        // Sau khi kết nối thành công, lắng nghe yêu cầu
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được cơ sở dữ liệu
    }
};

// Gọi hàm khởi động server
startServer();

// Đóng kết nối khi server dừng
process.on('SIGINT', async () => {
    await db.destroy();
    console.log('Đã đóng kết nối cơ sở dữ liệu!');
    process.exit(0);
});


