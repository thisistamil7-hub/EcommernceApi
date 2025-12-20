import nodemailer, { Transporter } from "nodemailer"
// Create transporter based on environment
const createTransporter = (): Transporter => {
  // For development using Ethereal
  if (process.env.EMAIL_SERVICE === 'ethereal') {
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      throw new Error("Ethereal email credentials not set");
    }
   return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.ethereal.email",
      port: Number(process.env.EMAIL_PORT) || 587,
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

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
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

