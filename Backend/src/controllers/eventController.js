// controllers/eventController.js
const { Event } = require("../models/eventModel");

// Controller to create an event (Restricted to Teacher, Faculty, Alumni, Admin)
const createEventController = async (req, res) => {
  try {
    // SECURITY CHECK: 'faculty' ko add kar diya hai
    const allowedRoles = ["teacher", "faculty", "alumni", "admin"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Teachers, Faculty, Alumni, and Admins can post events.",
      });
    }

    // FRONTEND SE AANE WALE SAARE FIELDS NIKAL LIYE
    const { title, date, time, location, type, description } = req.body;
    const createdBy = req.user._id; 

    // DATABASE MEIN SAVE
    const event = await Event.create({
      title,
      date,
      time,        // Added time
      location,
      type,        // Added type (Online/Offline)
      description,
      createdBy,
    });

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to get all events
const getAllEventsController = async (req, res) => {
  try {
    // Populate added so frontend knows who posted it
    const events = await Event.find().populate(
      "createdBy",
      "firstName lastName role" 
    ); 

    res.status(200).json({
      status: "success",
      data: {
        events,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Controller to delete an event (Admin super-power)
const deleteEventController = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found." });
    }

    // SECURITY CHECK: Only Admin can delete any event (or the original creator)
    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Admins can delete events.",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      status: "success",
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { 
  createEventController, 
  getAllEventsController,
  deleteEventController
};