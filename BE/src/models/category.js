const {db} = require('../config/db');
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


const categoryMethods = {
    getAllRootCategories: () => {
        return db('categories').where("parentID", null);
    },

    getCategoryTree: async () => {
        try {
            const categories = await db('categories').select('catID', 'catName', 'parentID');

            if (categories.length === 0) {
                throw new Error('No categories found.');
            }

            const categoryMap = new Map();
            categories.forEach(category => {
                categoryMap.set(category.catID, { ...category, children: [] });
            });

            const tree = [];

            categories.forEach(category => {
                if (category.parentID === null || category.parentID === undefined) {
                    tree.push(categoryMap.get(category.catID));
                } else {
                    const parentCategory = categoryMap.get(category.parentID);
                    if (parentCategory) {
                        parentCategory.children.push(categoryMap.get(category.catID));
                    }
                }
            });

            if (tree.length === 0) {
                throw new Error('No root categories found.');
            }
            return tree;
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    },


    getAllChildrenCategoriesByCatID: (id) => {
        return db('categories').where('parentID', id);
    },

    getCategoryByCatId: async (id) => {
        try {
            const categoryDetail = await db('categories').where('CatId', id).first();

            if (categoryDetail === null) {
                throw new Error(`No categories found`);
            }
            return categoryDetail;
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    },

    getCategoryByName: (categoryName) => {
        return db('categories').where('CatName', categoryName).select('CatId').first();
    },

    addCategory: (category) => {
        return db('categories').insert(category);
    },

    deleteCategory: (id) => {
        return db('categories').where('CatId', id).del();
    },

    deleteCategoryByParentId: (id) => {
        return db('categories').where('ParentId', id).del();
    },

    updateCategory: (id, category) => {
        return db('categories').where('CatId', id).update({
            CatName: category?.CatName,
        });
    },

    getChildCategoriesByParentId: (parentId) => {
        return db('categories').where('ParentId', parentId);
    },

    isParentCategory: async (id) => {
        const [{ count }] = await db('categories')
            .where('ParentId', id)
            .count({ count: '*' });
        return count > 0;
    },
};

module.exports = { categoryMethods };
