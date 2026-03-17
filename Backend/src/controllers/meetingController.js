// Backend/src/controllers/meetingController.js
const mongoose = require("mongoose");

// Ek chota sa schema meeting link save karne ke liye
const meetingSchema = new mongoose.Schema({
  link: String,
  hostRole: String,
  createdAt: { type: Date, default: Date.now }
});

// Agar model pehle se nahi bana hai toh bana lo
const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);

// 1. Link Save Karne Ki API (Alumni ke liye)
const saveMeetingLink = async (req, res) => {
  try {
    const { link, role } = req.body;
    
    // Purane saare links delete kar do taaki sirf latest wala bache
    await Meeting.deleteMany({}); 
    
    const newMeeting = await Meeting.create({ link, hostRole: role });
    res.status(200).json({ status: "success", data: newMeeting });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// 2. Link Get Karne Ki API (Students/Teachers ke liye)
const getMeetingLink = async (req, res) => {
  try {
    const meeting = await Meeting.findOne().sort({ createdAt: -1 }); // Latest link lao
    res.status(200).json({ status: "success", link: meeting ? meeting.link : "" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { saveMeetingLink, getMeetingLink };