const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require('dotenv').config();  // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());  // Allow CORS requests
app.use(express.json());  // To parse JSON request body

// Access environment variables
var myemail = process.env.SENDER_EMAIL;
var mypassword = process.env.APPLICATION_PASSWORD;
const receiverEmail = "umusa7677@gmail.com"; // Hardcoding the recipient's email

// Logging for debugging
console.log('Sender Email:', myemail);
console.log('Receiver Email:', receiverEmail);

// Send email function
function sendEmail(formData) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myemail,
        pass: mypassword,
      },
    });

    const mail_configs = {
      from: formData.email, // Sender's email
      to: receiverEmail, // Receiver's email
      subject: "New Contact Message",
      html: `
        <h1>New Message from ${formData.name}</h1>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
      `,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error occurred while sending the email.` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const formData = { name, email, message };

  sendEmail(formData)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
});

app.get('/', (req, res) => {
  res.send("testing my first api hosting using vercel");
  console.log("testing my first api hosting using vercel");
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
