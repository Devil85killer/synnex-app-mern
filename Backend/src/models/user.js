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
  
  // Naye fields jo tere Frontend Register form se aayenge
  firstName: { type: String },
  lastName: { type: String },
  startYear: { type: String },
  endYear: { type: String },
  degree: { type: String },
  branch: { type: String },
  rollNumber: { type: String },

}, { timestamps: true }); // timestamps se created_at aur updated_at khud ban jayega

const User = mongoose.model("User", UserSchema);

module.exports = { User };