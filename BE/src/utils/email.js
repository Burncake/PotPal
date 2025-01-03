const nodemailer = require('nodemailer');

const sendEmail = async (email, otpCode) => {
    try {
        // Cấu hình email server
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Sử dụng Gmail (hoặc SMTP khác)
            auth: {
                user: 'your-email@gmail.com', // Thay bằng email của bạn
                pass: 'your-email-password' // Thay bằng mật khẩu ứng dụng
            }
        });

        // Nội dung email
        const mailOptions = {
            from: '"Your App Name" <your-email@gmail.com>',
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${otpCode}`,
            html: `<p>Your verification code is: <strong>${otpCode}</strong></p>`
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
