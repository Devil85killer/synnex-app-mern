const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");
const newsRoutes = require("./newsRoutes"); 
const adminRoute = require("./adminRoute");
const chatRoute = require("./chatRoute");
const meetingRoutes = require("./meetingRoute");

// 🔥 NAYA: Complaint route ko import kiya
const complaintRoutes = require("./complaintRoutes"); 

router.use("/register", registerRoute);
router.use("/events", eventRoutes); 
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);
router.use("/news", newsRoutes);
router.use("/admin", adminRoute);
router.use("/chat", chatRoute);
router.use("/meeting", meetingRoutes);

// 🔥 NAYA: Complaint route ko connect kar diya (Purana send-mail hata diya)
router.use("/complaints", complaintRoutes);

module.exports = router;
