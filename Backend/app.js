require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookiesParser = require("cookie-parser");
const app = express();
const router = require("./src/routes");

// 1. IMPORT MEETING CONTROLLER
const { saveMeetingLink, getMeetingLink } = require('./src/controllers/meetingController');
const { User } = require("./src/models/user"); 

let Job, Event, News;

try { 
    const EventModel = require("./src/models/eventModel");
    Event = EventModel.Event || EventModel; 
} catch (e) { console.log("Event model not found or path is incorrect."); }

try { 
    // 🔥 FIX 1: JOB MODEL IMPORT
    const JobModel = require("./src/models/job");
    Job = JobModel.Job || JobModel; 
} catch (e) { console.log("Job model not found or path is incorrect."); }

try { 
    const NewsModel = require("./src/models/newsModel");
    News = NewsModel.News || NewsModel; 
} catch (e) { console.log("News model not found or path is incorrect."); }

// ============================================================
// 🚀 THE ULTIMATE CORS CONFIGURATION 🚀
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
// ADMIN PANEL APIs
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
        
        // 🔥 FIX 2: Admin Panel se Time aur Type nahi aata, isliye default values daal di taaki Mongoose crash na kare!
        if(!eventData.time) eventData.time = "10:00 AM"; 
        if(!eventData.type) eventData.type = "Offline / In-person";
        if(!eventData.description) eventData.description = "Admin Event";

        const newEvent = new Event(eventData);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) { 
        console.error("Admin Event Error:", error);
        res.status(500).json({ message: "Failed to create event" }); 
    }
});

// 🔥🔥🔥 YE WALA ROUTE TUNE MISS KAR DIYA THA 🔥🔥🔥
app.delete('/api/admin/event/:id', async (req, res) => {
    try {
        if (!Event) return res.status(400).json({ message: "Event model not found" });
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) { 
        console.error("Admin Event Delete Error:", error);
        res.status(500).json({ message: "Failed to delete event" }); 
    }
});
// 🔥🔥🔥========================================🔥🔥🔥

app.get('/api/admin/all-news', async (req, res) => {
    try {
        if (!News) return res.status(200).json([]);
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// ============================================================
// 🚀 ROUTING CONFIGURATION 🚀
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