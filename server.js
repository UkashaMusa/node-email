// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // For handling cross-origin requests

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Enable CORS to allow frontend to communicate with backend (if on different ports)
app.use(cors());

// Create a transporter object using your email service's SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Gmail or another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // sender's email
    to: process.env.EMAIL_USER, // recipient's email (can be your email)
    subject: `Message from ${name}`, // Subject of the email
    text: message, // Plain text message body
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`, // HTML message body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'Failed to send message' });
    }
    res.status(200).json({ message: 'Message sent successfully' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
