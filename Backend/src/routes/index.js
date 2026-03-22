const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");

// FIXED: News route ab active hai!
const newsRoutes = require("./newsRoutes"); 

// Ye `/api/` lagne ke baad ab saare routes theek jagah point karenge
router.use("/register", registerRoute);
router.use("/events", eventRoutes); 
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);

// FIXED: News wala route bhi yahan connect kar diya hai
router.use("/news", newsRoutes);

module.exports = router;