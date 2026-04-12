const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); 
const Feedback = require("../models/feedbackModel");

// 🔥 APPROVE USER API 🔥
router.put("/user/:userId/approve", async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `${updatedUser.firstName} has been approved!`,
      user: updatedUser 
    });

  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

// 🔥 Saara Feedback Get Karne Ki API Admin Ke Liye 🔥
router.get("/all-feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 }); 

    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

// 🔥 NAYA: User se Feedback receive/save karne ki API (Jo miss ho gayi thi) 🔥
router.post("/submit-feedback", async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Naya feedback save kar rahe hain
    const newFeedback = await Feedback.create({ userId, message });
    
    res.status(200).json({ success: true, message: "Feedback saved", data: newFeedback });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

module.exports = router;
