// src/models/product.js
class Product {
    constructor(id, name, price, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

// Dummy data (giả lập dữ liệu)
const products = [
    new Product(1, "Laptop", 1000, "High performance laptop"),
    new Product(2, "Smartphone", 500, "Latest smartphone model"),
];

// Lấy tất cả sản phẩm
function getAllProducts() {
    return products;
}

// Lấy sản phẩm theo ID
function getProductById(id) {
    return products.find((product) => product.id === id);
}

module.exports = { Product, getAllProducts, getProductById };