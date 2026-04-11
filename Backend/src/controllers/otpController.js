const OTP = require("../models/otpModel"); 
const nodemailer = require("nodemailer");
const dns = require("dns"); // 🔥 NAYA: DNS module import kiya

// 🔥 MAGIC WAND: Ye line Node.js ko force karegi IPv4 use karne ke liye, 
// jisse Render ka IPv6 block bypass ho jayega!
dns.setDefaultResultOrder("ipv4first");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("👉 STEP 1: Request received for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Database operations 
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOtp });
    console.log("👉 STEP 2: DB work done. Sending email...");

    // Setup Nodemailer with standard secure port 465
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Synnex - Registration OTP",
      html: `<h3>Welcome to Synnex!</h3>
             <p>Your OTP for registration is: <b style="font-size:24px; color:blue;">${generatedOtp}</b></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    console.log("👉 STEP 3: Connecting to Gmail (IPv4)...");
    await transporter.sendMail(mailOptions);
    console.log("👉 STEP 4: Email sent successfully!");

    res.status(200).json({ success: true, message: "OTP sent successfully!" });

  } catch (error) {
    console.error("❌ OTP Send Error Detail:", error);
    res.status(500).json({ 
      message: "Failed to send OTP.", 
      errorDetail: error.message 
    });
  }
};

module.exports = { sendOTP };