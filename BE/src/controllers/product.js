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
    const prodID = req.params.id; // Get prodID from URL params
    const limit = req.query.limit || 5; // Get limit from query or default to 5

    // Ensure prodID is a string and add leading zeros if necessary
    const formattedProdID = String(prodID).padStart(5, '0'); // Ensure the ID is a string with padding

    try {
        // Call the model method to get related products
        let relatedProducts = await productMethods.relatedProductsByProID(formattedProdID, limit);

        // Format the prodID for each related product
        relatedProducts = relatedProducts.map(product => {
            const paddedProdID = String(product.prodID).padStart(5, '0'); // Format the prodID with leading zeros
            return {
                ...product,
                prodID: paddedProdID, // Assign the formatted prodID
            };
        });

        // Return the result as a JSON response
        return res.status(200).json({
            status: 'success',
            data: relatedProducts
        });
    } catch (error) {
        // Handle errors and return error message
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};
const getProductsByCatID = async (req, res) => {
    const { id } = req.params; // Lấy catID từ tham số URL đúng cách
    try {
        // Gọi phương thức trong model để lấy sản phẩm theo catID
        const result = await productMethods.getProductsByCatID(id);

        const products = result.products;
        const catName = result.catName;

        // Định dạng lại prodID cho từng sản phẩm
        const formattedProducts = products.map(product => {
            // Đảm bảo prodID có ít nhất 5 ký tự và có thêm số 0 ở phía trước nếu cần
            const formattedProdID = String(product.prodID).padStart(5, '0');
            return {
                ...product,
                prodID: formattedProdID, // Cập nhật lại prodID với định dạng đúng
            };
        });

        // Trả về sản phẩm đã định dạng
        return res.status(200).json({
            status: 'success',
            data: {
                products: formattedProducts,
                catName: catName
            }
        });
    } catch (e) {
        return res.status(500).json({
            status: 'error',
            message: e.message
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const productData = req.body;


        // Kiểm tra dữ liệu từ client
        if (!productData.prodName || !productData.price || !productData.stock) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });

        }
        // Thêm sản phẩm vào cơ sở dữ liệu

        const newProduct = await productMethods.addProduct(productData);

        // Trả kết quả về frontend
        return res.status(201).json({ status: 'success', data: newProduct });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await productMethods.updateProduct(id, req.body, req.files);
        return res.status(200).json({ status: 'success', message: 'Product updated successfully', data: result });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await productMethods.deleteProduct(id);
        return res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductByID,
    getDetailProductByProdID,
    getRelatedProductsByProID,
    getProductsByCatID,
    addProduct,
    updateProduct,
    deleteProduct
}