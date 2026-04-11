const OTP = require("../models/otpModel"); 

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("👉 STEP 1: Request received for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Generate 4-digit random OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Database operations (Ye ekdum sahi chal raha hai)
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: generatedOtp });
    console.log("👉 STEP 2: DB work done. OTP saved in database.");

    // 3. RENDER BLOCK BYPASS (Demo Mode)
    console.log("👉 STEP 3: Skipping Email dispatch. Sending OTP directly to frontend for Demo.");

    // 🔥 Dhyan de: Yahan response mein 'demoOtp' bhej rahe hain
    res.status(200).json({ 
      success: true, 
      message: "OTP generated successfully! (Check your Network tab/Console)",
      demoOtp: generatedOtp 
    });

  } catch (error) {
    console.error("❌ OTP Send Error Detail:", error.message);
    res.status(500).json({ 
      message: "Failed to process OTP.", 
      errorDetail: error.message 
    });
  }
};

module.exports = { sendOTP };