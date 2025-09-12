const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

// ✅ Create a new order
router.post('/', createOrder);

// ✅ Get all orders
router.get('/', getAllOrders);

// ✅ Get a single order by custom orderId (e.g., 00001)
router.get('/:orderId', getOrderById);

// ✅ Delete an order by custom orderId
router.delete('/:orderId', deleteOrder);

// ✅ Update order status by custom orderId
router.patch('/:orderId/status', updateOrderStatus);

module.exports = router;
