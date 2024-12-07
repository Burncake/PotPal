// ./config/dbConfig.js

require('dotenv').config(); // Tải các biến môi trường từ .env file

const mysql = require('mysql2');

// Cấu hình kết nối với MySQL
const dbConfig = {
    host: process.env.DB_HOST,// Địa chỉ host (ví dụ: localhost)
    user: process.env.DB_USER,    // Tên người dùng MySQL
    password: process.env.DB_PASSWORD, // Mật khẩu người dùng
    database: process.env.DB_NAME, // Tên cơ sở dữ liệu
};

// Tạo kết nối MySQL
const connection = mysql.createConnection(db);

// Kiểm tra kết nối
connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối cơ sở dữ liệu: ', err);
        return;
    }
    console.log('Kết nối thành công đến cơ sở dữ liệu MySQL');
});

module.exports = connection;
