const cloudinary = require('cloudinary').v2;

// Cấu hình với thông tin API của bạn
cloudinary.config({
    cloud_name: 'your-cloud-name', // Thay bằng Cloud Name
    api_key: 'your-api-key',      // Thay bằng API Key
    api_secret: 'your-api-secret' // Thay bằng API Secret
});

module.exports = cloudinary;
