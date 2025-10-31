const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  // For development using Ethereal
  if (process.env.EMAIL_SERVICE === 'ethereal') {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // Add other email services as needed
  throw new Error('Email service configuration not found');
};

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      // You can add HTML version later
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent to ${to}`);
    
    // For Ethereal, log the preview URL (useful in development)
    if (process.env.EMAIL_SERVICE === 'ethereal') {
      console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;