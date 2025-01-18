const nodemailer = require("nodemailer");
const crypto = require("crypto");
const user = require("../database/usermodel"); // Make sure this is the correct import
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();


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


router.post("/verify-changepassword", async (req, res) => {
  const { password, otp, email } = await req.body;

  // Validate required fields
  if (!password || !otp || !email) {
    return res.status(400).redirect("/auth")
  }

  // Check if OTP is valid
  if (!otpStorage[email] || otpStorage[email] !== otp) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  delete otpStorage[email]; // Clear OTP after verification

  try {
    // Check if the user exists
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await user.updateOne(
      { email }, // Filter
      { $set: { password: hashedPassword } } // Update operation
    );

    // Clear sensitive data and send success response
    return res.status(200).json({ message: "Password updated successfully. Please log in again." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




router.post("/send-otpchange",async (req, res) => {
  const { email } = req.body;

  const existingUser = await user.findOne({ email });
  if(!existingUser)  return res.status(200).json({ success: false, message: "No such User with this email found" })
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
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email", error });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  });
  

  // Set expiration for the OTP (10 minutes)
  setTimeout(() => {
    delete otpStorage[email];
  }, 5 * 60 * 1000);
});




// Route to send OTP to the user's email
router.post("/send-otp",async (req, res) => {
  const { email } = req.body;

  const existingUser = await user.findOne({ email });
  if(existingUser)  return res.status(200).json({ success: false, message: "The User already Exist" })
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
      console.error("Error sending email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email", error });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  });
  

  // Set expiration for the OTP (10 minutes)
  setTimeout(() => {
    delete otpStorage[email];
  }, 5 * 60 * 1000);
});

// Route to verify the OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp, fullname, password, mobile } = req.body; // Updated to `mobile`

  // Check if OTP is valid
  if (otpStorage[email] && otpStorage[email] === otp) {
    delete otpStorage[email]; // Clear OTP after verification

    try {
      // Check if email or phone number already exists
      const existingUser = await user.findOne({
        $or: [{ email: email }, { mobile: mobile }] // Updated to `mobile`
      });

      if (existingUser) {
        return res.status(400).json({ message: "Credentials already used", red: "/auth" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      await user.create({
        name: fullname,
        email: email,
        mobile: mobile, // Updated to `mobile`
        password: hashedPassword
      });

      let token = jwt.sign(
        {
          name: fullname,
          email: email,
          mobile: mobile // Updated to `mobile`
        },
        process.env.secretkey,
        { expiresIn: '2h' }
      );

      // Set token in a secure, httpOnly cookie and redirect to "getstarted"
      return res.status(201)
        .cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" })
        .cookie("name",fullname)
        .cookie("email",email)
        .cookie("mobile",mobile)
        .redirect("/getstarted");
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).send("Invalid or expired OTP");
  }
});






module.exports = router;
