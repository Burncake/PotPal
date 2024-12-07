// src/models/category.js

// Abstract base class for Category
class CategoryComponent {
    constructor(categoryID, categoryName, description) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.description = description;
    }

    // Abstract methods to be overridden
    getID() {
        return this.categoryID;
    }

    getName() {
        return this.categoryName;
    }

    getDescription() {
        return this.description;
    }
}

// CategoryLeaf: Represents individual (leaf) categories with no subcategories
class CategoryLeaf extends CategoryComponent {
    constructor(categoryID, categoryName, description) {
        super(categoryID, categoryName, description);
    }
}

// CategoryComposite: Represents categories with subcategories
class CategoryComposite extends CategoryComponent {
    constructor(categoryID, categoryName, description) {
        super(categoryID, categoryName, description);
        this.subCategoryList = []; // Array of CategoryComponent (leaf or composite)
    }

    // Add a subcategory
    addCategory(category) {
        if (category instanceof CategoryComponent) {
            this.subCategoryList.push(category);
        } else {
            throw new Error("Only instances of CategoryComponent can be added.");
        }
    }

    // Remove a subcategory
    deleteCategory(category) {
        this.subCategoryList = this.subCategoryList.filter(
            (subCategory) => subCategory !== category
        );
    }

    // Get the list of subcategories
    getSubCategories() {
        return this.subCategoryList;
    }
}

// Example usage
const mainCategory = new CategoryComposite("C001", "Laptops", "All laptop categories");
const gamingCategory = new CategoryLeaf("C002", "Gaming Laptops", "High-performance laptops for gaming");
const ultrabookCategory = new CategoryLeaf("C003", "Ultrabooks", "Lightweight, high-performance laptops");

// Adding subcategories to main category
mainCategory.addCategory(gamingCategory);
mainCategory.addCategory(ultrabookCategory);

// Logging category structure
console.log("Main Category:", mainCategory.getName());
console.log("Subcategories:", mainCategory.getSubCategories().map((cat) => cat.getName()));

module.exports = { CategoryComponent, CategoryLeaf, CategoryComposite };

const db = require('../config/potpal');

// Lấy tất cả danh mục
exports.getCategories = () => {
    return db('categories');
};

// Lấy danh mục theo ID
exports.getCategoryById = (id) => {
    return db('categories').where('CatId', id).first();
};

// Lấy danh mục theo tên
exports.getCategoryByName = (categoryName) => {
    return db('categories').where('CatName', categoryName).select('CatId').first();
};

// Thêm danh mục mới
exports.addCategory = (category) => {
    return db('categories').insert(category);
};

// Thêm hình ảnh chính cho sản phẩm qua raw query
exports.addRawCategory = (id, image) => {
    return db.raw(`UPDATE products SET ImageMain = '${image}' WHERE ProId = '${id}'`);
};

// Xóa danh mục theo ID
exports.deleteCategory = (id) => {
    return db('categories').where('CatId', id).del();
};

// Xóa danh mục theo Parent ID
exports.deleteCategoryByParentId = (id) => {
    return db('categories').where('ParentId', id).del();
};

// Cập nhật danh mục
exports.updateCategory = (id, category) => {
    return db('categories').where('CatId', id).update({
        CatName: category?.CatName,
    });
};

// Lấy danh mục cha
exports.getParentCategories = () => {
    return db('parentcategories');
};

// Thêm danh mục cha mới
exports.addParentCategory = (parentCategory) => {
    return db('parentcategories').insert(parentCategory);
};

// Xóa danh mục cha theo ID
exports.deleteParentCategory = async (id) => {
    const result = await db('parentcategories').where('ParentId', id).del();
    return result;
};

// Cập nhật danh mục cha
exports.updateParentCategory = (id, parentCategory) => {
    return db('parentcategories').where('ParentId', id).update(parentCategory);
};

// Lấy danh mục con theo Parent ID
exports.getChildCategoriesByParentId = (parentId) => {
    return db('categories').where('ParentId', parentId);
};

// Kiểm tra danh mục có phải là cha
exports.isParentCategory = async (id) => {
    const [{ count }] = await db('categories')
        .where('ParentId', id)
        .count({ count: '*' });
    return count > 0;
};