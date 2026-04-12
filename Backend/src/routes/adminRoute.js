const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); // Path check kar lena agar alag ho toh
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

// 🔥 NAYA: Saara Feedback Get Karne Ki API Admin Ke Liye 🔥
router.get("/all-feedback", async (req, res) => {
  try {
    // .populate() use kar rahe hain taaki 'userId' ke badle user ka Asli Naam mil sake
    const feedbacks = await Feedback.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 }); // Naya feedback sabse upar

    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

module.exports = router;
