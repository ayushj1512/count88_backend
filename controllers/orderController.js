const Order = require('../models/Order');
const { sendEmailNotification } = require('../utils/sendEmailNotification');
const { generateOrderEmail } = require('../utils/emailTemplates');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerMobile,
      products,
      totalProducts,
      totalQuantity,
      totalAmount,
      shippingAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!customerName || !customerEmail || !customerMobile) {
      return res.status(400).json({ error: 'Customer name, email, and mobile are required' });
    }

    if (!products || !products.length) {
      return res.status(400).json({ error: 'No products provided' });
    }

    const order = new Order({
      customerName,
      customerEmail,
      customerMobile,
      products,
      totalProducts,
      totalQuantity,
      totalAmount,
      shippingAmount,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await order.save();

    // 📩 Email notifications
    const orderData = {
      customerName,
      customerEmail,
      orderId: savedOrder._id.toString(),
      items: products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
      shippingAddress,
    };

    const { subject, html } = generateOrderEmail(orderData);

    // Send email to customer
    await sendEmailNotification({
      to: customerEmail,
      subject,
      text: '',
      html,
    });

    // Send email to admin
    await sendEmailNotification({
      to: 'ayushjuneja999@gmail.com',
      subject: `📬 New Order Received - #${savedOrder._id.toString()}`,
      text: '',
      html,
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error while creating order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Server error while fetching order' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Server error while deleting order' });
  }
};

// Update order status only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.orderStatus = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error while updating order status' });
  }
};
