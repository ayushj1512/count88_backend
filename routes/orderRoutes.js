const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

// POST: Create a new order
router.post('/', createOrder);

// GET: All orders
router.get('/', getAllOrders);

// GET: Single order by ID
router.get('/:id', getOrderById);

// DELETE: Delete an order
router.delete('/:id', deleteOrder);

// PATCH: Update order status only
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
