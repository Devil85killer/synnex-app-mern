require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookiesParser = require("cookie-parser");
const app = express();
const router = require("./src/routes");

// 🔥 1. YAHAN TERA MEETING CONTROLLER IMPORT KIYA HAI
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');
const { User } = require("./src/models/user"); 

let Job, Event, News;

try { 
    const EventModel = require("./src/models/eventModel");
    Event = EventModel.Event || EventModel; 
} catch (e) { console.log("Event model check kar bhai!"); }

try { 
    Job = require("./src/models/job"); 
} catch (e) { console.log("Job model check kar bhai!"); }

try { 
    const NewsModel = require("./src/models/newsModel");
    News = NewsModel.News || NewsModel; 
} catch (e) { console.log("News model check kar bhai!"); }

// 🚀🚀 THE ULTIMATE CORS FIX (BRAMHASTRA) 🚀🚀
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); 
    }
    next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(`${__dirname}/public`));
app.use(cookiesParser());

// 🔥 TERE MEETING KE ROUTES
app.post('/api/meeting', saveMeetingLink);
app.get('/api/meeting', getMeetingLink);

// ============================================================
// 🕵️‍♂️ ADMIN PANEL KE APIS
// ============================================================

app.get('/api/admin/all-users', async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
  } catch (error) { res.status(500).json({ message: "Error fetching users" }); }
});

app.delete('/api/admin/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) { res.status(500).json({ message: "Failed to delete user" }); }
});

app.get('/api/admin/all-jobs', async (req, res) => {
  try {
    if (!Job) return res.status(200).json([]); 
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) { res.status(500).json({ message: "Failed to fetch jobs" }); }
});

app.put('/api/admin/job/:id/:action', async (req, res) => {
    try {
        if (!Job) return res.status(400).json({ message: "Job model not found" });
        if (req.params.action === 'delete') {
            await Job.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Job deleted" });
        }
        res.status(400).json({ message: "Action not supported yet" });
    } catch (error) { res.status(500).json({ message: "Failed to process job action" }); }
});

app.get('/api/admin/all-events', async (req, res) => {
  try {
    if (!Event) return res.status(200).json([]);
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) { res.status(500).json({ message: "Failed to fetch events" }); }
});

app.post('/api/admin/event', async (req, res) => {
    try {
        if (!Event) return res.status(400).json({ message: "Event model not found" });
        const eventData = req.body;
        eventData.createdBy = new mongoose.Types.ObjectId("000000000000000000000000"); 
        if(!eventData.description) eventData.description = "Admin Event";
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) { res.status(500).json({ message: "Failed to create event" }); }
});

app.get('/api/admin/all-news', async (req, res) => {
    try {
        if (!News) return res.status(200).json([]);
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// ============================================================
// 🚀 THE MAGIC FIX FOR 404 ERRORS 🚀
// ============================================================
// Ye sabse zaroori line hai. Frontend "/api" bhejta hai, toh backend ko bhi "/api" pe sunna hoga!
app.use("/api", router);

// Base route zinda rakhne ke liye taaki website crash na ho
app.get("/", (req, res) => {
    res.send("Synnex Backend is up and running smoothly! 🚀");
});

const PORT = process.env.PORT || 4000;

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, function () { console.log("Server is running on port : ", PORT); });

module.exports = app;