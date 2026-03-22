require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookiesParser = require("cookie-parser");
const app = express();
const router = require("./src/routes");

// 1. IMPORT CONTROLLERS & MODELS
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');
const { User } = require("./src/models/user"); 

// 🔥 NAYE MODELS IMPORT KIYE HAIN CONNECTION KE LIYE
let Job, Event, News, Feedback;

try { 
    const EventModel = require("./src/models/eventModel");
    Event = EventModel.Event || EventModel; 
} catch (e) { console.log("Event model check kar bhai!"); }

try { 
    const JobModel = require("./src/models/job");
    Job = JobModel.Job || JobModel; 
} catch (e) { console.log("Job model check kar bhai!"); }

try { 
    const NewsModel = require("./src/models/newsModel");
    News = NewsModel.News || NewsModel; 
} catch (e) { console.log("News model check kar bhai!"); }

try { 
    // Agar feedbackModel nahi hai toh folder mein file bana dena (Schema neeche hai)
    Feedback = require("./src/models/feedbackModel"); 
} catch (e) { console.log("Feedback model abhi missing hai!"); }

// ============================================================
// 🚀 THE ULTIMATE CORS CONFIGURATION (BRAMHASTRA)
// ============================================================
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

// MEETING ROUTES
app.post('/api/meeting', saveMeetingLink);
app.get('/api/meeting', getMeetingLink);

// ============================================================
// 🕵️‍♂️ ADMIN PANEL APIs (FULL CONNECTION)
// ============================================================

// --- USER MANAGEMENT ---
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

// --- JOB BOARD CONTROL ---
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

// --- EVENT MANAGER ---
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
        if(!eventData.time) eventData.time = "10:00 AM"; 
        if(!eventData.type) eventData.type = "Offline";
        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) { res.status(500).json({ message: "Failed to create event" }); }
});

app.delete('/api/admin/event/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// --- NEWS & NOTICES CONNECTION ---
app.get('/api/admin/all-news', async (req, res) => {
    try {
        if (!News) return res.status(200).json([]);
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) { res.status(500).json({ message: "Error fetching news" }); }
});

app.post('/api/admin/news', async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const newNotice = new News({ title, content, type, createdBy: new mongoose.Types.ObjectId("000000000000000000000000") });
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (error) { res.status(500).json({ message: "Failed to publish notice" }); }
});

// --- FEEDBACK CONNECTION ---
app.get('/api/admin/all-feedback', async (req, res) => {
    try {
        if (!Feedback) return res.status(200).json([]);
        const feedbacks = await Feedback.find().populate("userId", "firstName lastName email");
        res.status(200).json(feedbacks);
    } catch (error) { res.status(500).json({ message: "Error fetching feedback" }); }
});

// --- BULK IMPORT (DUMMY CONNECTION FOR UI) ---
app.post('/api/admin/bulk-import', async (req, res) => {
    res.status(200).json({ message: "Import functionality ready to be implemented with Multer!" });
});

// ============================================================

app.use("/api", router);
app.use("/", router); 

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