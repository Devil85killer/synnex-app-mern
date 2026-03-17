require("dotenv").config(); // Sabse zaroori line, ekdum top par!

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const app = express();
const router = require("./src/routes");

// 🔥 1. YAHAN TERA MEETING CONTROLLER IMPORT KIYA HAI
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');

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

// 🔥 2. YAHAN TERE MEETING KE ROUTES JOD DIYE HAIN (router se theek pehle)
app.post('/api/meeting', saveMeetingLink);
app.get('/api/meeting', getMeetingLink);

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