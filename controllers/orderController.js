const Order = require('../models/Order');
const Product = require('../models/productModel'); // 🔹 Import Product model
const Counter = require('../models/Counter');
const { sendEmailNotification } = require('../utils/sendEmailNotification');
const { generateOrderEmail } = require('../utils/emailTemplates');

// Helper → next 5-digit orderId
async function getNextOrderId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'orderId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value.toString().padStart(5, '0');
}

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { uid, customerName, customerEmail, customerMobile, cartItems, shippingAddress, paymentMethod } = req.body;

    if (!uid || !customerName || !customerEmail || !customerMobile)
      return res.status(400).json({ error: 'uid, name, email, and mobile are required' });
    if (!cartItems || !cartItems.length)
      return res.status(400).json({ error: 'No products in cart' });

    // 🔹 Fetch product snapshots
    const products = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: product._id.toString(),
        name: product.name,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        gender: product.gender,
        size: item.size,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: item.quantity,
        image: product.images[0] || {},
      };
    }));

    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = products.reduce((sum, p) => sum + (p.discountPrice || p.price) * p.quantity, 0);

    const newOrderId = await getNextOrderId();
    const order = new Order({
      uid,
      orderId: newOrderId,
      customerName,
      customerEmail,
      customerMobile,
      products,
      totalProducts: products.length,
      totalQuantity,
      totalAmount,
      shippingAmount: 50, // Example fixed shipping amount
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();

    // 📩 Send emails
    const orderData = {
      customerName,
      customerEmail,
      orderId: savedOrder.orderId,
      items: products.map(p => ({ name: p.name, quantity: p.quantity, price: p.price })),
      totalAmount,
      shippingAddress,
    };
    const { subject, html } = generateOrderEmail(orderData);

    await sendEmailNotification({ to: customerEmail, subject, text: '', html });
    await sendEmailNotification({
      to: 'ayushjuneja999@gmail.com',
      subject: `📬 New Order - #${savedOrder.orderId}`,
      text: '',
      html
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message || 'Server error while creating order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
};

// Get orders by uid
exports.getOrdersByUid = async (req, res) => {
  try {
    const { uid } = req.params;
    const orders = await Order.find({ uid }).sort({ createdAt: -1 });
    if (!orders.length) return res.status(201).json({ error: 'No orders found for this user' });
    res.json(orders);
  } catch (err) {
    console.error('Get orders by UID error:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
};

// Get order by orderId
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Get order by ID error:', err);
    res.status(500).json({ error: 'Server error while fetching order' });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ error: 'Server error while deleting order' });
  }
};

// Update status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Order status is required' });
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.orderStatus = status;
    await order.save();
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Server error while updating order status' });
  }
};
