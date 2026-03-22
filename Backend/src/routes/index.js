const express = require("express");
const router = express.Router();

const registerRoute = require("./registerRoute");
const loginRoute = require("./loginRoute");
const alumniListRoute = require("./alumniListRoute");
const jobRoutes = require("./jobRoutes");
const eventRoutes = require("./eventRoutes");
// AGAR tune News ka controller banaya hai toh isko uncomment karna:
// const newsRoutes = require("./newsRoutes"); 

router.get("/", (req, res) => {
  res.send("Synnex API is up and running.");
});

// FIXED: /event ko /events kar diya taaki Frontend se match kare
router.use("/register", registerRoute);
router.use("/events", eventRoutes); // <-- YAHAN 'S' LAGAYA HAI
router.use("/auth", loginRoute);
router.use("/alumni", alumniListRoute);
router.use("/jobs", jobRoutes);

// AGAR News routes hain toh yahan add honge:
// router.use("/news", newsRoutes);

module.exports = router;