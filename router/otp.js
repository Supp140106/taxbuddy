const nodemailer = require("nodemailer");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

// Set up your transporter (use Gmail as an example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: "lzkhaayggybqdhad", // Replace with your email password
  },
});

// Temporary storage for OTPs
let otpStorage = {};

// Route to send OTP to the user's email
router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  // Generate a random OTP (6 digits)
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP temporarily (you can store it in a database in real-world applications)
  otpStorage[email] = otp;

  // Send OTP to the user's email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: email, // Recipient email
    subject: "Your One-Time Password (OTP) for TaxBuddy",
    text: `Dear User,

Your One-Time Password (OTP) is: ${otp}. Please note that this OTP is valid for the next 5 minutes only.

If you did not request this OTP, please disregard this message.

Thank you for choosing TaxBuddy.
Warm regards,
Team TaxBuddy`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error); // More detailed error logging
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response); // Log the success response
    res.status(200).send("OTP sent to your email");
  });

  // Set expiration for the OTP (10 minutes)
  setTimeout(() => {
    delete otpStorage[email];
  }, 5 * 60 * 1000);
});

// Route to verify the OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP is valid
  if (otpStorage[email] && otpStorage[email] === otp) {
    delete otpStorage[email]; // Clear OTP after verification
    res.status(200).send("OTP verified successfully");
  } else {
    res.status(400).send("Invalid or expired OTP");
  }
});

module.exports = router;
