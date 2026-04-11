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
    console.log("👉 STEP 2: OTP Generated:", generatedOtp);

    // Database operations
    console.log("👉 STEP 3: Connecting to DB to delete old OTP...");
    await OTP.deleteMany({ email });
    console.log("👉 STEP 4: Old OTPs deleted. Saving new OTP...");
    await OTP.create({ email, otp: generatedOtp });
    console.log("👉 STEP 5: New OTP saved in DB successfully.");

    // Nodemailer
    console.log("👉 STEP 6: Setting up Nodemailer...");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // 🔥 NAYA: Connection timeout add kiya hai taaki atke nahi
      connectionTimeout: 10000, 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Synnex - Registration OTP",
      html: `<h3>Welcome to Synnex!</h3>
             <p>Your OTP for registration is: <b style="font-size:24px; color:blue;">${generatedOtp}</b></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    console.log("👉 STEP 7: Sending email over network...");
    await transporter.sendMail(mailOptions);
    console.log("👉 STEP 8: Email sent successfully!");

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