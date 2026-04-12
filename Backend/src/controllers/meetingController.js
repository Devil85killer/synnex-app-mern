// Backend/src/controllers/meetingController.js
const mongoose = require("mongoose");

// Ek chota sa schema meeting link aur time save karne ke liye
const meetingSchema = new mongoose.Schema({
  link: String,
  time: String, // 🔥 NAYA: Frontend se aane wala time yahan store hoga
  hostRole: String,
  createdAt: { type: Date, default: Date.now }
});

// Agar model pehle se nahi bana hai toh bana lo
const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

// 1. Link Save Karne Ki API (Alumni/Admin ke liye)
const saveMeetingLink = async (req, res) => {
  try {
    const { link, time, role } = req.body; // 🔥 NAYA: 'time' ko body se nikal liya
    
    // Purane saare links delete kar do taaki sirf latest wala bache
    await Meeting.deleteMany({}); 
    
    // 🔥 NAYA: 'time' ko database mein save kar diya
    const newMeeting = await Meeting.create({ link, time, hostRole: role });
    res.status(200).json({ status: "success", data: newMeeting });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// 2. Link Get Karne Ki API (Students ke liye)
const getMeetingLink = async (req, res) => {
  try {
    const meeting = await Meeting.findOne().sort({ createdAt: -1 }); // Latest link lao
    
    // 🔥 NAYA: Response mein 'link' ke sath 'time' bhi bhej rahe hain
    res.status(200).json({ 
      status: "success", 
      link: meeting ? meeting.link : "",
      time: meeting ? meeting.time : "" // 🔥 NAYA
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { saveMeetingLink, getMeetingLink };
