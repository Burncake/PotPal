require('dotenv').config(); // Đảm bảo biến môi trường được tải
const jwt = require('jsonwebtoken');

// Middleware để kiểm tra token
const authenticateToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token sau "Bearer "

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Xác minh token với SECRET_KEY
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Gán thông tin user vào request để sử dụng ở các bước sau
        req.user = user;
        next();
    });
};

// Middleware để kiểm tra quyền của user (nếu cần)
const authorizeRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.length) return next();

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
        }

        next();
    };
};

module.exports = { authenticateToken, authorizeRole };