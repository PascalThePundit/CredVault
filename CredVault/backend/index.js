require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use a strong secret in production

// Middleware
app.use(cors({
    origin: 'http://localhost:3003', // Allow frontend to connect
    credentials: true
}));
app.use(express.json());

// Mock Database (for demonstration purposes)
const users = []; // Stores { id, email, password, phone, role, isEmailVerified, isPhoneVerified, emailOtp, phoneOtp }
const otps = {}; // Stores { email: otp, phone: otp }

// Nodemailer transporter setup (using ethereal.email for testing)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.EMAIL_PASS || 'ethereal.password'
    }
});

// Twilio client setup
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     process.env.TWILIO_AUTH_TOKEN || 'your_auth_token'
// );
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+15017122661'; // Your Twilio phone number

// Helper to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Routes
app.post('/api/auth/register', async (req, res) => {
    console.log('Backend received registration request with body:', req.body);
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    let user = users.find(u => u.email === email);
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        phone: null, // Phone will be added during phone verification
        role,
        isEmailVerified: true,
        isPhoneVerified: true,
        emailOtp: null,
        phoneOtp: null
    };
    users.push(user);

    // // Send email OTP immediately after registration
    // const otp = generateOtp();
    // otps[email] = otp; // Store OTP temporarily
    // user.emailOtp = otp; // Store OTP with user for verification

    // try {
    //     await transporter.sendMail({
    //         from: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
    //         to: email,
    //         subject: 'CredVault Email Verification OTP',
    //         html: `Your OTP for email verification is: <strong>${otp}</strong>`
    //     });
        res.status(201).json({ message: 'User registered successfully. Email verification skipped.' });
    // } catch (error) {
    //     console.error('Error sending email OTP:', error);
    //     res.status(500).json({ message: 'Error sending email OTP.' });
    // }
});

// app.post('/api/auth/send-email-otp', async (req, res) => {
//     const { email } = req.body;
//     const user = users.find(u => u.email === email);
// 
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     if (user.isEmailVerified) {
//         return res.status(400).json({ message: 'Email already verified' });
//     }
// 
//     const otp = generateOtp();
//     otps[email] = otp;
//     user.emailOtp = otp;
// 
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
//             to: email,
//             subject: 'CredVault Email Verification OTP',
//             html: `Your OTP for email verification is: <strong>${otp}</strong>`
//         });
//         res.status(200).json({ message: 'Email OTP sent for verification.' });
//     } catch (error) {
//         console.error('Error sending email OTP:', error);
//         res.status(500).json({ message: 'Error sending email OTP.' });
//     }
// });
// 
// app.post('/api/auth/verify-email-otp', (req, res) => {
//     const { email, otp } = req.body;
//     const user = users.find(u => u.email === email);
// 
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     if (user.isEmailVerified) {
//         return res.status(400).json({ message: 'Email already verified' });
//     }
// 
//     if (user.emailOtp === otp) { // Check against user's stored OTP
//         user.isEmailVerified = true;
//         user.emailOtp = null; // Clear OTP after verification
//         delete otps[email]; // Remove from temporary store
//         res.status(200).json({ message: 'Email verified successfully.' });
//     } else {
//         res.status(400).json({ message: 'Invalid OTP.' });
//     }
// });

// app.post('/api/auth/send-phone-otp', async (req, res) => {
//     const { email, phone } = req.body;
//     const user = users.find(u => u.email === email);
// 
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     if (!user.isEmailVerified) {
//         return res.status(400).json({ message: 'Email must be verified first.' });
//     }
//     if (user.isPhoneVerified) {
//         return res.status(400).json({ message: 'Phone already verified' });
//     }
// 
//     user.phone = phone; // Store phone number with user
//     const otp = generateOtp();
//     otps[phone] = otp;
//     user.phoneOtp = otp;
// 
//     try {
//         await twilioClient.messages.create({
//             body: `Your CredVault phone verification OTP is: ${otp}`,
//             from: twilioPhoneNumber,
//             to: phone
//         });
//         res.status(200).json({ message: 'Phone OTP sent for verification.' });
//     } catch (error) {
//         console.error('Error sending phone OTP:', error);
//         res.status(500).json({ message: 'Error sending phone OTP.' });
//     }
// });
// 
// app.post('/api/auth/verify-phone-otp', (req, res) => {
//     const { email, otp } = req.body;
//     const user = users.find(u => u.email === email);
// 
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     if (!user.isEmailVerified) {
//         return res.status(400).json({ message: 'Email must be verified first.' });
//     }
//     if (user.isPhoneVerified) {
//         return res.status(400).json({ message: 'Phone already verified' });
//     }
// 
//     if (user.phoneOtp === otp) { // Check against user's stored OTP
//         user.isPhoneVerified = true;
//         user.phoneOtp = null; // Clear OTP after verification
//         delete otps[user.phone]; // Remove from temporary store
//         res.status(200).json({ message: 'Phone verified successfully.' });
//     } else {
//         res.status(400).json({ message: 'Invalid OTP.' });
//     }
// });

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
        return res.status(400).json({ message: 'Please complete email and phone verification.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, isPhoneVerified: user.isPhoneVerified } });
});

// Start server
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));