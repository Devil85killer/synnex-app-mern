const mongoose = require("mongoose");
// 🔥 1. IMPORT BCRYPTJS HERE
const bcrypt = require("bcryptjs");

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

}, { timestamps: true }); 

// =================================================================
// 🔥 2. NAYA CHOWKIDAAR (PRE-SAVE HOOK) JO PASSWORD KO HASH KAREGA
// =================================================================
UserSchema.pre("save", async function (next) {
  // Agar password modify nahi hua (jaise profile update mein), toh skip kar do
  if (!this.isModified("password")) {
    return next();
  }

  // Agar naya password ban raha hai, toh hash karo
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };