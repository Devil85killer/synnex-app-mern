const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["alumni", "admin", "college", "student", "teacher"], 
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true, // 🔥 Instant approval on registration
  },
  
  // Fields coming from the Frontend Register form
  firstName: { type: String },
  lastName: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  degree: { type: String },
  branch: { type: String },
  rollNumber: { type: String },

  // 🔥 NEW FIELD: Security Question for Password Reset
  secretAnswer: {
    type: String,
    required: true,
    default: "mumbai" // Failsafe default for existing users in the DB
  }

}, { timestamps: true }); // timestamps automatically handle created_at and updated_at

const User = mongoose.model("User", UserSchema);

module.exports = { User };