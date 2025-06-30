const nodemailer = require('nodemailer');

// Debug logs to verify env variables (safe in dev only)
console.log('📧 MAIL_USER:', process.env.MAIL_USER);
console.log('🔒 MAIL_PASS exists:', !!process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendEmailNotification = async ({ to, subject, text, html }) => {
    try {
        console.log(`📤 Sending email to: ${to}`);

        await transporter.sendMail({
            from: `"CRAFTЯA" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text: text || '', // fallback empty text if only HTML provided
            html: html || '', // fallback empty HTML if only text provided
        });

        console.log('✅ Email sent!');
    } catch (error) {
        console.error('❌ Email error:', error.message);
        if (error.response) {
            console.error('📩 Response from server:', error.response);
        }
    }
};

module.exports = { sendEmailNotification };
