const { OTP } = require("../models/otpModel");
const nodemailer = require("nodemailer");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Generate 4-digit random OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Save to Database (Pehle purane OTPs hata do is email ke)
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOtp });

    // 🔥 3. Nodemailer Setup (UPDATED FOR RENDER STABILITY)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for port 465
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

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent successfully!" });

  } catch (error) {
    // 🔥 ASLI ERROR CONSOLE AUR FRONTEND MEIN BHEJO
    console.error("OTP Send Error Detail:", error);
    res.status(500).json({ 
      message: "Failed to send OTP.", 
      errorDetail: error.message // Ab frontend pe pata chalega exact error kya hai
    });
  }
};

module.exports = { sendOTP };