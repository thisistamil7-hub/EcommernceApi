// utils/createTestAccount.js
const nodemailer = require('nodemailer');

async function createEtherealAccount() {
    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal Email Credentials:');
        console.log('EMAIL_USERNAME:', testAccount.user);
        console.log('EMAIL_PASSWORD:', testAccount.pass);
        console.log('SMTP Host: smtp.ethereal.email');
        console.log('SMTP Port: 587');
    } catch (error) {
        console.error('Error creating test account:', error);
    }
}

createEtherealAccount();