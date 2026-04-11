const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); // Path check kar lena agar alag ho toh

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

// Agar tere paas baaki admin APIs (jaise all-users) nahi hain, toh tu unko bhi isi file mein add kar sakta hai aage chal kar.

module.exports = router;
