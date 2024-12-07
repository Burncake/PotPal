// src/models/product.js
class Product {
    constructor(productID, name, description, price, stock, category, imageUrl, available, discount) {
        this.productID = productID;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category; // Array of categories (e.g., "Gaming", "Ultrabook")
        this.imageUrl = imageUrl;
        this.available = available;
        this.discount = discount;
    }

    // Phương thức để lấy Brand ID từ description (từ đầu tiên)
    extractBrandID() {
        return this.description.split(' ')[0];
    }

    // Phương thức để lấy phần còn lại của description (bỏ Brand ID)
    extractRemainingDescription() {
        const parts = this.description.split(' ');
        parts.shift(); // Xóa phần tử đầu tiên (Brand ID)
        return parts.join(' '); // Ghép lại phần còn lại thành chuỗi
    }

    // Lấy tất cả thông tin sản phẩm
    getInfo() {
        return {
            productID: this.productID,
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            category: this.category,
            imageUrl: this.imageUrl,
            available: this.available,
            discount: this.discount,
            brandIDDescription: this.extractBrandID(),                      // Lấy Brand ID
            remainingDescription: this.extractRemainingDescription(), // Phần còn lại của description
        };
    }

    // Update the product name
    updateName(name) {
        this.name = name;
    }

    // Update the product description
    updateDescription(description) {
        this.description = description;
    }

    // Update the product price
    updatePrice(price) {
        this.price = price;
    }

    // Increase the stock
    addStock(quantity) {
        this.stock += quantity;
    }

    // Decrease the stock
    removeStock(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
        } else {
            throw new Error("Insufficient stock to remove");
        }
    }

    // Update categories (add new category or remove an existing one)
    updateCategoryByName(add, remove) {
        if (add) {
            this.category.push(add);
        }
        if (remove) {
            this.category = this.category.filter((cat) => cat !== remove);
        }
    }

    // Alert when stock is low
    alertLowStock() {
        if (this.stock < 5) {
            console.warn(`Warning: Stock for ${this.name} is running low`);
        }
    }

    // Check if the product is available
    isAvailable() {
        return this.available && this.stock > 0;
    }

    // Update discount
    modifyDiscount(discount) {
        this.discount = discount;
    }
}

// Sample laptops (dummy data)
const laptops = [
    new Product(
        "L001",
        "Gaming Laptop",
        "High-performance laptop designed for gaming",
        1500,
        20,
        ["Gaming", "Performance"],
        "gaming-laptop.jpg",
        true,
        15
    ),
    new Product(
        "L002",
        "Ultrabook Laptop",
        "Lightweight laptop for professionals",
        1200,
        15,
        ["Ultrabook", "Lightweight"],
        "ultrabook-laptop.jpg",
        true,
        10
    ),
    new Product(
        "L003",
        "Budget Laptop",
        "Affordable laptop for everyday use",
        500,
        50,
        ["Budget", "Everyday Use"],
        "budget-laptop.jpg",
        true,
        5
    ),
];

// Get all laptops
function getAllLaptops() {
    return laptops;
}

// Get a laptop by ID
function getLaptopById(productID) {
    return laptops.find((laptop) => laptop.productID === productID);
}

module.exports = { Product, getAllLaptops, getLaptopById };


const db = require('../config/db');

// Lấy tất cả sản phẩm
exports.getProducts = () => {
    return db('products');
};

// Lấy thông tin sản phẩm theo ID
exports.getProductById = (prodId) => {
    return db('products').where('prodID', prodId).first();
};

// Thêm sản phẩm mới
exports.addProduct = (product) => {
    return db('products').insert(product);
};

// Cập nhật sản phẩm theo ID
exports.updateProduct = (id, product) => {
    return db('products').where('prodID', id).update(product);
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (id) => {
    const result = await db('products').where('prodID', id).del();
    return result;
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCatId = async (catId, page, limit) => {
    const data = await db('products')
        .where('catID', catId)
        .limit(limit)
        .offset((page - 1) * limit);

    const [{ total }] = await db('products')
        .where('catID', catId)
        .count({ total: '*' });

    const totalPages = Math.ceil(total / limit);
    return { data, total, totalPages };
};

// Tìm kiếm sản phẩm theo tên
exports.searchProducts = async (keyword) => {
    return db('products').where('prodName', 'like', `%${keyword}%`);
};

// Lấy chi tiết sản phẩm theo ID (không kèm danh mục)
exports.getDetailProductById = (id) => {
    return db('products')
        .where('products.prodID', id)
        .first();
};

// Lấy sản phẩm liên quan theo danh mục
exports.relatedProductsByCatId = (catId) => {
    return db('products')
        .where('catID', catId)
        .orderByRaw('RAND()')
        .limit(9);
};

// Cập nhật hình ảnh chính của sản phẩm
exports.updateMainImage = (id, mainImage) => {
    return db('products').where('prodID', id).update({ mainImage });
};

// Cập nhật mảng hình ảnh của sản phẩm
exports.updateImageArray = (id, imageArray) => {
    return db('products').where('prodID', id).update({ imageArray });
};

// Thay đổi trạng thái sản phẩm
exports.changeProductStatus = (id, status) => {
    return db('products').where('prodID', id).update({ prodStatus: status });
};


