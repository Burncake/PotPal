const discountMethods = require('../models/discount');

const addDiscount = async (req, res) => {
    try {
        const result = await discountMethods.addDiscount(req.body);
        return res.status(201).json({ status: 'success', message: result.message || "Discount added successfully" });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

const updateDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await discountMethods.updateDiscount(id, req.body);
        return res.status(200).json({ status: 'success', message: result.message || "Discount updated successfully" });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

const deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await discountMethods.deleteDiscount(id);
        return res.status(200).json({ status: 'success', message: result.message || "Discount deleted successfully" });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await discountMethods.getAllDiscounts();
        return res.status(200).json({ status: 'success', data: discounts });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};


module.exports = {
    addDiscount,
    updateDiscount,
    deleteDiscount,
    getAllDiscounts
};
