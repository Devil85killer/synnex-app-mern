const OTP = require("../models/otpModel"); 
const nodemailer = require("nodemailer");
const dns = require("dns");

// 🔥 IPv6 Bypass: Force Node.js to use IPv4 so Render doesn't throw ENETUNREACH
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
    console.log("👉 STEP 2: DB work done. OTP saved in database.");

    console.log("👉 STEP 3: Setting up Nodemailer...");
    
    // 🔥 BULLETPROOF NODEMAILER CONFIG
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // 🔥 TIMEOUTS: Taaki infinite pending me na atke
      connectionTimeout: 10000, 
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // 🔥 DEBUGGING: Ab logs me exactly dikhega Gmail kya bol raha hai
      logger: true,
      debug: true
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Synnex - Registration OTP",
      html: `<h3>Welcome to Synnex!</h3>
             <p>Your OTP for registration is: <b style="font-size:24px; color:blue;">${generatedOtp}</b></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    console.log("👉 STEP 4: Handshaking with Gmail SMTP...");
    await transporter.sendMail(mailOptions);
    console.log("👉 STEP 5: Email sent successfully!");

    res.status(200).json({ success: true, message: "OTP sent successfully!" });

  } catch (error) {
    console.error("❌ OTP Send Error Detail:", error.message);
    res.status(500).json({ 
      message: "Failed to send OTP.", 
      errorDetail: error.message 
    });
  }
};

module.exports = { sendOTP };