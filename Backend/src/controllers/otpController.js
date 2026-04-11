const OTP = require("../models/otpModel"); 
const nodemailer = require("nodemailer");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("👉 STEP 1: Request received for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Database operations (Ab ye perfectly chalega)
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOtp });
    console.log("👉 STEP 2: DB work done. Sending email...");

    // 🔥 WAPAS PURANA AUR SABSE STABLE TARIQA (No custom ports)
    const transporter = nodemailer.createTransport({
      service: "gmail", 
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

    await transporter.sendMail(mailOptions);
    console.log("👉 STEP 3: Email sent successfully!");

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