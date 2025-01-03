const { categoryMethods } = require('../models/category');

const getAllRootCategories = async (req, res) => {
    try {
        const result = await categoryMethods.getAllRootCategories();
        return res.status(200).json({"status": "success", "data": result});
    }
    catch (error) {
        return res.status(500).json({"status": "error", "message": error.message});
    }
}

const getCategoryByCatId = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryMethods.getCategoryByCatId(id);
        return res.status(200).json({"status": "success", "data": category});
    }
    catch (error) {
        return res.status(500).json({"status": "error", "message": error.message});
    }
}

const getAllChildrenCategoriesByCatID = async (req, res) => {
    try {
        const id = req.params.id;
        const catList = await categoryMethods.getAllChildrenCategoriesByCatID(id);
        return res.status(200).json({"status": "success", "data": catList});
    }
    catch (error) {
        return res.status(500).json({"status": "error", "message": error.message});
    }
}

const getCategoryTree = async (req, res) => {
    try {
        // Lấy cây danh mục từ model
        const categoryTree = await categoryMethods.getCategoryTree();

        // Trả kết quả về cho client
        return res.status(200).json({
            "status": 'success',
            "data": categoryTree,
        });
    } catch (error) {
        return res.status(500).json({
            "status": 'error',
            "message": error.message,
        });
    }
};

module.exports = {
    getAllRootCategories,
    getCategoryByCatId,
    getAllChildrenCategoriesByCatID,
    getCategoryTree
}