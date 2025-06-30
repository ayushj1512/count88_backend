const generateOrderEmail = (order) => {
    const {
        customerName,
        items,
        totalAmount,
        shippingAddress,
        orderId,
    } = order;

    const itemsHtml = items.map(
        (item) =>
            `<tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px 8px;">${item.name}</td>
        <td style="padding: 10px 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 8px; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    return {
        subject: `🛒 Order Confirmation - Order #${orderId}`,
        html: `
      <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- 🏷️ Branding -->
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px; color: #2c3e50;">CRAFTЯA</h1>
            <p style="margin: 4px 0 0; color: #888;">Where Craft Meets Commerce.</p>
          </div>

          <!-- ✅ Greeting -->
          <h2 style="text-align: center; color: #2c3e50; margin-top: 30px;">Thank you for your order, ${customerName}!</h2>
          <p style="text-align: center; color: #555;">Order <strong>#${orderId}</strong> has been placed successfully.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <!-- 🧾 Order Summary -->
          <h3 style="color: #333;">📦 Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 15px;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="text-align: left; padding: 10px;">Product</th>
                <th style="text-align: center; padding: 10px;">Qty</th>
                <th style="text-align: right; padding: 10px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p style="text-align: right; font-size: 16px; margin-top: 15px;">
            <strong>Total: ₹${totalAmount}</strong>
          </p>

          <!-- 🚚 Shipping -->
          <h3 style="margin-top: 30px; color: #333;">🏠 Shipping Address</h3>
          <p style="white-space: pre-line; line-height: 1.6; color: #555;">
            ${typeof shippingAddress === 'string' ? shippingAddress : formatAddress(shippingAddress)}
          </p>

          <!-- 🔔 Note -->
          <p style="margin-top: 30px; color: #444;">We’ll notify you once your order is shipped. Thank you for choosing <strong>Craftra</strong> 🎉</p>

          <!-- 📩 Footer -->
          <p style="text-align: center; font-size: 13px; color: #aaa; margin-top: 40px;">
            This is an automated email. Please do not reply.<br>
            © ${new Date().getFullYear()} Craftra. All rights reserved.
          </p>
        </div>
      </div>
    `,
    };
};

// Optional: Address formatting helper
const formatAddress = (address) => {
    return `${address.houseNumber || ''}, ${address.streetAddress || ''}
${address.city}, ${address.state} - ${address.pincode}
${address.landmark ? 'Landmark: ' + address.landmark : ''}`;
};

module.exports = { generateOrderEmail };
