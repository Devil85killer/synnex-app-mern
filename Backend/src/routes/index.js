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
const { sendMailController } = require("../controllers/emailController");

// 🔥 FIX: Sahi path se import kiya (kyunki dono files ek hi folder mein hain)
const meetingRoutes = require("./meetingRoute");

router.use("/register", registerRoute);
router.use("/events", eventRoutes); 
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);
router.use("/news", newsRoutes);
router.use("/admin", adminRoute);
router.use("/chat", chatRoute);

// 🔥 FIX: Meeting route ko connect kar diya
router.use("/meeting", meetingRoutes);

// Email Route
router.post('/send-mail', sendMailController);

module.exports = router;
