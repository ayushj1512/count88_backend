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
      `<tr style="border-top:1px solid #f1f1f1;">
        <td style="padding:12px 8px; color:#333;">${item.name}</td>
        <td style="padding:12px 8px; text-align:center; color:#333;">${item.quantity}</td>
        <td style="padding:12px 8px; text-align:right; color:#333;">₹${item.price * item.quantity}</td>
      </tr>`
  ).join('');

  return {
    subject: `Order Confirmation - Order #${orderId}`, // ✅ Spam safe subject
    text: `Hello ${customerName},\n\nThank you for your order #${orderId}.\n\nTotal: ₹${totalAmount}\n\nWe will ship to:\n${typeof shippingAddress === 'string' ? shippingAddress : formatAddress(shippingAddress)}\n\n-Team Count 88`, // ✅ Plain text fallback
    html: `
    <body style="margin:0; padding:0; background-color:#f5f2ef; font-family:'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width:650px; margin:auto; background:#fff; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,0.08); padding:32px; border:1px solid #e5d5d5;">

        <!-- Branding -->
        <div style="text-align:center; margin-bottom:28px; padding-bottom:20px; border-bottom:2px solid #eee;">
          <h1 style="margin:0; font-size:32px; color:#800000; font-family:Arial, sans-serif;">Count 88</h1>
          <p style="margin:8px 0 0; color:#666; font-size:15px; font-style:italic; letter-spacing:0.3px;">
            Step into Tradition, Walk with Style
          </p>
        </div>

        <!-- Greeting -->
        <h2 style="text-align:center; color:#111; margin:20px 0; font-size:20px; font-weight:600;">
          Hello ${customerName},
        </h2>
        <p style="text-align:center; color:#555; font-size:15px; line-height:1.7; margin:0 0 24px;">
          Thank you for your order <strong style="color:#800000;">#${orderId}</strong>.
        </p>

        <!-- Order Summary -->
        <h3 style="color:#000; margin-bottom:14px; font-size:18px;">
          Order Summary
        </h3>
        <table style="width:100%; border-collapse:collapse; font-size:14px; border:1px solid #eaeaea; border-radius:8px; overflow:hidden;">
          <thead>
            <tr style="background-color:#fcf6f6;">
              <th style="text-align:left; padding:12px; font-weight:600; color:#111;">Product</th>
              <th style="text-align:center; padding:12px; font-weight:600; color:#111;">Qty</th>
              <th style="text-align:right; padding:12px; font-weight:600; color:#111;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="text-align:right; font-size:16px; margin-top:18px; font-weight:bold; color:#800000;">
          Total: ₹${totalAmount}
        </p>

        <!-- Shipping -->
        <h3 style="margin-top:32px; color:#000; font-size:18px;">
          Shipping Address
        </h3>
        <p style="white-space:pre-line; line-height:1.7; color:#555; font-size:14px; margin:8px 0 0;">
          ${typeof shippingAddress === 'string' ? shippingAddress : formatAddress(shippingAddress)}
        </p>

        <!-- Note -->
        <p style="margin-top:20px; color:#444; font-size:14px; text-align:center; line-height:1.7;">
          Your handcrafted footwear will be shipped soon.  
          Thank you for choosing <strong style="color:#800000;">Count 88</strong>.
        </p>

        <!-- Footer -->
        <p style="text-align:center; font-size:12px; color:#888; margin-top:40px; line-height:1.5; border-top:1px solid #eee; padding-top:18px;">
          This is an automated email, please do not reply.<br>
          Need help? Contact us at <a href="mailto:help.count88@gmail.com" style="color:#800000; text-decoration:none;">help.count88@gmail.com</a>.<br>
          © ${new Date().getFullYear()} Count 88. All rights reserved.<br>
          <a href="https://count88.in/unsubscribe" style="color:#888; text-decoration:underline;">Unsubscribe</a>
        </p>
      </div>
    </body>
    `,
  };
};

// Address formatting helper
const formatAddress = (address) => {
  return `${address.houseNumber || ''}, ${address.streetAddress || ''}
${address.city}, ${address.state} - ${address.pincode}
${address.landmark ? 'Landmark: ' + address.landmark : ''}`;
};

module.exports = { generateOrderEmail };
