const {db} = require('../config/db');

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

// Tạo object chứa các hàm thao tác với sản phẩm
const productMethods = {
    getAllProducts: async () => {
        try {
            // Fetching the products from the database
            const res = await db('products');

            // Check if the response is null or undefined
            if (res === null || res === undefined) {
                throw new Error('No products found in database.');
            }

            // Ensure prodID is a string and add leading zeros if necessary
            const productsWithStringIDs = res.map(product => {
                // Convert prodID to string and ensure it has a fixed length with leading zeros
                const prodID = String(product.prodID).padStart(5, '0'); // Adjust the number 5 to your desired length
                return {
                    ...product,
                    prodID, // Ensure prodID is a padded string
                };
            });

            // Return the products with the correctly formatted prodID
            return productsWithStringIDs;
        } catch (error) {
            // If there is an error, throw a detailed message
            throw new Error(`Failed to fetch product details: ${error.message}`);
        }
    },


    getProductByID: async (prodID) => {
        const res = await db('products')
            .where('prodID', prodID);
    },

    addProduct: (product) => {
        return db('products').insert(product);
    },

    updateProduct: (id, product) => {
        return db('products').where('prodID', id).update(product);
    },

    deleteProductByID: async (id) => {
        const result = await db('products').where('prodID', id).del();
        return result;
    },

    getProductsByCatId: async (catID, page, limit) => {
        const data = await db('products')
            .where('catID', catID)
            .limit(limit)
            .offset((page - 1) * limit);

        const [{ total }] = await db('products')
            .where('catID', catID)
            .count({ total: '*' });

        const totalPages = Math.ceil(total / limit);
        return { data, total, totalPages };
    },

    searchProducts: async (keyword) => {
        return db('products').where('prodName', 'like', `%${keyword}%`);
    },

    //done
    getDetailProductByProdID: async (prodIDs) => {
        try {
            // Nếu prodIDs là một chuỗi, chuyển thành mảng
            if (!Array.isArray(prodIDs)) {
                prodIDs = [prodIDs];
            }

            const products = await db('products')
                .select('prodID', 'prodName', 'price', 'description', 'stock', 'mainImage', 'processor', 'ram', 'storage')
                .whereIn('prodID', prodIDs);

            if (products.length === 0) {
                throw new Error('No products found with the given IDs.');
            }
            const categories = await db('productsCategories as pc')
                .join('categories as c', 'pc.catID', 'c.catID')
                .select('pc.prodID', 'pc.catID', 'c.catName')
                .whereIn('pc.prodID', prodIDs);
            const categoryMap = {};
            categories.forEach((cat) => {
                if (!categoryMap[cat.prodID]) {
                    categoryMap[cat.prodID] = [];
                }
                categoryMap[cat.prodID].push({ catID: cat.catID, catName: cat.catName });
            });

            products.forEach((product) => {
                product.prodID = String(product.prodID).padStart(5, '0'); // padStart để thêm '0' nếu cần

                product.category = categoryMap[product.prodID] || [];
            });

            return products;
        } catch (error) {
            throw new Error(`Failed to fetch product details: ${error.message}`);
        }
    },



    //undone
    relatedProductsByCatID: (catID, limit) => {
        return db('products')
            .where('catID', catID)
            .orderByRaw('RAND()')
            .limit(limit);
    },

    //undone
    relatedProductsByProID: async (prodID, limit) => {
        try {
            // Lấy danh sách catID từ bảng productsCategories theo prodID
            const catIDs = await db('productsCategories')
                .select('catID')
                .where('prodID', prodID);

            if (!catIDs || catIDs.length === 0) {
                throw new Error(`Product with ID ${prodID} does not exist or has no categories.`);
            }

            // Lấy danh sách prodID khác từ bảng productsCategories thuộc các catID đã lấy
            const relatedProductIDs = await db('productsCategories')
                .select('prodID')
                .whereIn('catID', catIDs.map(row => row.catID))
                .andWhere('prodID', '!=', prodID);

            if (!relatedProductIDs || relatedProductIDs.length === 0) {
                return []; // Không có sản phẩm liên quan
            }

            // Lấy thông tin chi tiết sản phẩm từ bảng products
            const relatedProducts = await db('products')
                .whereIn('prodID', relatedProductIDs.map(row => row.prodID))
                .orderByRaw('RAND()') // Lấy ngẫu nhiên
                .limit(limit);

            return relatedProducts;
        } catch (error) {
            throw new Error(`Failed to fetch related products: ${error.message}`);
        }
    },



    updateMainImageByID: (id, mainImage) => {
        return db('products').where('prodID', id).update({ mainImage });
    },

    updateImageArrayByID: (id, imageArray) => {
        return db('products').where('prodID', id).update({ imageArray });
    },

    changeProductStatusByID: (id, status) => {
        return db('products').where('prodID', id).update({ prodStatus: status });
    },

    getProductsByCatID: async (catID) => {
        try {
            // Lấy danh sách prodID từ bảng 'productsCategories'
            const proIDs = await db('productsCategories').select('prodID').where('catID', catID);

            // Kiểm tra nếu không có sản phẩm nào trong category này
            if (!proIDs || proIDs.length === 0) {
                throw new Error('No products in this category!');
            }

            // Lấy thông tin sản phẩm từ bảng 'products' dựa trên danh sách prodID
            const products = await db('products').whereIn('prodID', proIDs.map(item => item.prodID));

            // Lấy tên category từ bảng 'categories'
            const category = await db('categories').select('catName').where('catID', catID).first();

            // Kiểm tra nếu không tìm thấy tên category
            if (!category) {
                throw new Error('Category not found');
            }

            return {
                products: products,
                catName: category.catName
            };
        } catch (error) {
            throw new Error('Error fetching products by category: ' + error.message);
        }
    }


};



module.exports = { Product, productMethods };