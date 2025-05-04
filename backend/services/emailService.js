import nodemailer from 'nodemailer';

// Development: Ethereal Email (Fake SMTP)
const devTransport = async () => {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

// Production: Real Email Service (Gmail/SendGrid)
const prodTransport = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Initialize transporter based on environment
const transporter = process.env.NODE_ENV === 'production' 
    ? prodTransport() 
    : await devTransport();

// Generate a 6-digit OTP
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `Quick-Kart <${process.env.EMAIL_FROM || 'noreply@quickkart.com'}>`,
        to: email,
        subject: 'Your OTP Verification Code',
        html: `
            <h2>Quick-Kart Verification</h2>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>Valid for 10 minutes</p>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the Ethereal preview URL
    if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
};