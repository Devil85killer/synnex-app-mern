// controllers/eventController.js
const { Event } = require("../models/eventModel");

// Controller to create an event (Restricted to Teacher, Alumni, Admin)
const createEventController = async (req, res) => {
  try {
    // SECURITY CHECK: Allow only specific roles
    const allowedRoles = ["teacher", "alumni", "admin"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "Access Denied: Only Teachers, Alumni, and Admins can post events.",
      });
    }

    const { title, date, location, description } = req.body;
    const createdBy = req.user._id; 

    const event = await Event.create({
      title,
      date,
      location,
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
    // I added "role" to the populate so your frontend knows who posted it
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

// NEW: Controller to delete an event (Admin super-power)
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