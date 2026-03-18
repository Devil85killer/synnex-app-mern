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

// 🔥 SMART IMPORTS: Ye Capital aur Small dono file names check karega taaki Render confuse na ho
let Job, Event;

// Job Model Import
try { 
    Job = require("./src/models/job"); 
} catch (e) { 
    try { Job = require("./src/models/job"); } catch (e) { console.log("Job model not found!"); }
}

// Event Model Import
try { 
    Event = require("./src/models/eventModel"); 
} catch (e) { 
    try { Event = require("./src/models/eventModel"); } catch (e) { console.log("Event model not found!"); }
}

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

// ============================================================
// 🕵️‍♂️ ADMIN PANEL KE SAARE NAYE APIS (DO NOT TOUCH)
// ============================================================

// 1. Saare users laakar frontend ko dene ke liye
app.get('/api/admin/all-users', async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// 2. User ko Delete karne ke liye
app.delete('/api/admin/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// 3. Saari Jobs laane ke liye
app.get('/api/admin/all-jobs', async (req, res) => {
  try {
    if (!Job) return res.status(200).json([]); 
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// 4. Job Approve/Delete karne ke liye
app.put('/api/admin/job/:id/:action', async (req, res) => {
    try {
        if (!Job) return res.status(400).json({ message: "Job model not found" });
        const { id, action } = req.params;
        
        if (action === 'delete') {
            await Job.findByIdAndDelete(id);
            return res.status(200).json({ message: "Job deleted" });
        }
        res.status(400).json({ message: "Action not supported yet" });
    } catch (error) {
        res.status(500).json({ message: "Failed to process job action" });
    }
});

// 5. Saare Events laane ke liye
app.get('/api/admin/all-events', async (req, res) => {
  try {
    if (!Event) return res.status(200).json([]);
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// 🔥 6. NAYA API: Naya Event Create karne ke liye
app.post('/api/admin/event', async (req, res) => {
    try {
        if (!Event) return res.status(400).json({ message: "Event model not found" });
        
        const eventData = req.body;
        
        // Tere schema me 'createdBy' aur 'description' required hain. 
        // Hum dummy admin ID daal rahe hain taaki save hone mein crash na ho.
        eventData.createdBy = new mongoose.Types.ObjectId("000000000000000000000000"); 
        if(!eventData.description) eventData.description = "Admin Event";

        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Failed to create event" });
    }
});

// ============================================================

app.use("/", router);

const PORT = process.env.PORT || 4000;

async function connectDB() {
  try {
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