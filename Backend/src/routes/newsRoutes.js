const express = require("express");
const router = express.Router();
const { createNewsController, getAllNewsController } = require("../controllers/newsController");
const checkAuth = require("../middlewares/checkAuth"); 

router.post("/create", checkAuth, createNewsController);
router.get("/all", checkAuth, getAllNewsController);

module.exports = router;