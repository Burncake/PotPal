const jwt = require('jsonwebtoken');
require('dotenv').config()

// Secret key để ký và xác thực token
const JWT_SECRET = process.env.SECRET_KEY;

// Middleware xác thực token
function authenticateToken(req, res, next) {
    // Lấy token từ header hoặc query hoặc body
    const token = req.headers['authorization']?.split(' ')[1] || req.body.token || req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid.' });
    }

    try {
        // Xác thực và giải mã token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào req để các middleware khác dùng
        next(); // Cho phép tiếp tục xử lý request
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = authenticateToken;
