require('dotenv').config(); // Load environment variables
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Enable CORS
app.use(cors());

// Ensure environment variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
  process.exit(1); // Exit the app if credentials are missing
}

// Create a transporter object using your email service's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail SMTP
  auth: {
    user: process.env.SENDER_EMAIL, // Your email address
    pass: process.env.APPLICATION_PASSWORD, // Your email's app password
  },
});

// POST route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Validate input fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: email, // Sender's email address
    to: process.env.EMAIL_USER, // Your email address (recipient)
    subject: `Message from ${name}`, // Email subject
    text: message, // Plain text message body
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`, // HTML message body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Message sent successfully' });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
