const express = require('express');
const bodyParser = require('body-parser');
const {db, checkConnection} = require('./src/config/db');

require('dotenv').config();
const productRoutes = require('./src/routes/product');

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Backend!');
});

(async () => {
    await checkConnection();
})

// Đóng kết nối khi server dừng
process.on('SIGINT', async () => {
    await db.destroy();
    console.log('Đã đóng kết nối cơ sở dữ liệu!');
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
