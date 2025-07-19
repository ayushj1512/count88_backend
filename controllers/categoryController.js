const Category = require('../models/Category');

// ✅ GET /api/categories → Fetch all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// ✅ POST /api/categories → Create new category
const createCategory = async (req, res) => {
    const { name, subcategories = [] } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, subcategories });
        const savedCategory = await newCategory.save();
        return res.status(201).json(savedCategory);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// ✅ PUT /api/categories/:id/add-subcategory → Add subcategories to a category
const addSubcategoriesToCategory = async (req, res) => {
    const { id } = req.params;
    const { subcategories = [] } = req.body;

    if (!subcategories.length) {
        return res.status(400).json({ message: 'Subcategories are required' });
    }

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newSubcategories = subcategories.filter(
            (sub) => !category.subcategories.includes(sub)
        );

        category.subcategories.push(...newSubcategories);
        const updatedCategory = await category.save();

        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(500).json({ message: 'Error adding subcategories', error: error.message });
    }
};

// ✅ PUT /api/categories/:id/edit-name → Edit category name
const editCategoryName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'New category name is required' });
    }

    try {
        const existing = await Category.findOne({ name });
        if (existing && existing._id.toString() !== id) {
            return res.status(409).json({ message: 'Another category with the same name already exists' });
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating category name', error: error.message });
    }
};

// ✅ DELETE /api/categories/:id → Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    addSubcategoriesToCategory,
    editCategoryName,
    deleteCategory,
};
