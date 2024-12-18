const { productMethods } = require('../models/product');

const getAllProducts = async (req, res) => {
    try {
        const products = await productMethods.getAllProducts();
        return res.status(200).json({"status": "success", "data": products});
    } catch (e) {
        return res.status(500).json({"status": "error", "message": e.message});
    }
};

const getProductByID = async (req, res) => {
    try {
        const id = req.params.id;
        const products = await productMethods.getProductByID(id);
        return res.status(200).json({"status": "success", "data": products});
    } catch (e) {
        return res.status(500).json({"status": "error", "message": e.message});
    }
};

const getDetailProductByProdID = async (req, res) => {
    const { id } = req.params; // ID có thể là một chuỗi hoặc mảng
    try {
        const productDetails = await productMethods.getDetailProductByProdID(id.split(',')); // Tách ID nếu là chuỗi
        return res.status(200).json({ status: 'success', data: productDetails });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const getRelatedProductsByProID = async (req, res) => {
    const prodID = req.params.id; // Lấy prodID từ URL params
    const limit = req.query.limit || 5; // Lấy limit từ query hoặc mặc định là 5

    try {
        // Gọi phương thức model để lấy sản phẩm liên quan
        const relatedProducts = await productMethods.relatedProductsByProID(prodID, limit);

        // Trả kết quả dưới dạng JSON
        return res.status(200).json({
            "status": "success",
            "data": relatedProducts
        });
    } catch (error) {
        // Xử lý lỗi và trả thông báo lỗi
        return res.status(400).json({
            "status": "error",
            "message": error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductByID,
    getDetailProductByProdID,
    getRelatedProductsByProID
}