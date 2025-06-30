const express = require('express');
const router = express.Router();
const { sendEmailNotification } = require('../utils/sendEmailNotification');

router.post('/test-email', async (req, res) => {
  try {
    await sendEmailNotification({
      to: 'yourpersonal@gmail.com', // Replace with your own email to receive
      subject: '📦 NewLakshiStore Test Email',
      text: 'This is a test email sent via Nodemailer setup.',
      html: '<h3>Hello from Craftra</h3><p>This is working ✅</p>',
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
