const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// POST: Create product with up to 10 images
router.post('/', upload.array('images', 10), createProduct);

// GET: All products
router.get('/', getAllProducts);

// GET: Single product by ID
router.get('/:id', getProductById);

// PUT: Update product (also supports image re-upload)
router.put('/:id', upload.array('images', 10), updateProduct);

// DELETE: Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
