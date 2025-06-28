const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  addSubcategoriesToCategory,
} = require('../controllers/categoryController');

// GET all categories
router.get('/', getAllCategories);

// POST create new category
router.post('/', createCategory);

// PUT add subcategories to an existing category
router.put('/:id/add-subcategories', addSubcategoriesToCategory);

module.exports = router;
