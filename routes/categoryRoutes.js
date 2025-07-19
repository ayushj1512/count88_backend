const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  addSubcategoriesToCategory,
  editCategoryName,
  deleteCategory,
} = require('../controllers/categoryController');

// GET all categories
router.get('/', getAllCategories);

// POST create new category
router.post('/', createCategory);

// PUT add subcategories to an existing category
router.put('/:id/add-subcategories', addSubcategoriesToCategory);

// PUT edit category name
router.put('/:id/edit-name', editCategoryName);

// DELETE delete category
router.delete('/:id', deleteCategory);

module.exports = router;
