const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");
const newsRoutes = require("./newsRoutes"); 
const adminRoute = require("./adminRoute");
// 🔥 NEW: Import the chat route we just created
const chatRoute = require("./chatRoute");
const { sendMailController } = require("../controllers/emailController");
// Ye `/api/` lagne ke baad ab saare routes theek jagah point karenge
router.use("/register", registerRoute);
router.use("/events", eventRoutes); 
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);
router.use("/news", newsRoutes);
router.use("/admin", adminRoute);
// 🔥 NEW: Connect the chat route
router.use("/chat", chatRoute);
// Email Route
router.post('/send-mail', sendMailController);
module.exports = router;