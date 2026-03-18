require("dotenv").config(); // Sabse zaroori line, ekdum top par!

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const app = express();
const router = require("./src/routes");

// 🔥 1. YAHAN TERA MEETING CONTROLLER IMPORT KIYA HAI
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');

// 🔥 2. NAYA: ADMIN PANEL KE LIYE USER MODEL IMPORT
const { User } = require("./src/models/user"); 

app.use(cors());
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static(`${__dirname}/public`));
app.use(cookiesParser());

// 🔥 TERE MEETING KE ROUTES
app.post('/api/meeting', saveMeetingLink);
app.get('/api/meeting', getMeetingLink);

// 🔥 3. NAYA: ADMIN API - SAARE USERS LAAKAR FRONTEND KO DENE KE LIYE
app.get('/api/admin/all-users', async (req, res) => {
  try {
    // Database se saare users nikalega, par unka password hide kar dega
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.use("/", router);

const PORT = process.env.PORT || 4000;

async function connectDB() {
  try {
    // Agar .env file read nahi hui toh yahan error dikhayega
    if (!process.env.MONGODB_URI) {
      throw new Error("Bhai, .env file read nahi ho rahi hai ya MONGODB_URI missing hai!");
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, function () {
  console.log("Server is running on port : ", PORT);
});

module.exports = app;