const { User } = require("../models/user");

const registerController = async (req, res) => {
  try {
    const {
      email, password, startYear, endYear,
      degree, branch, rollNumber, firstName,
      lastName, role, secretAnswer // 🔥 NAYA: secretAnswer yahan extract kiya
    } = req.body;

    const userRole = role.toLowerCase();
    console.log("Processing registration for role:", userRole);

    // 1. SECURITY FIX: Admin ko public route se register hone se roko
    if (userRole === "admin") {
        return res.status(403).json({
            status: "fail",
            message: "Admin registration is not allowed via this route.",
        });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered.",
      });
    }

    // 3. Create the unified User
    // Ab saara data (Student, Alumni, Teacher) ek hi table me direct save hoga! 🔥
    const newUser = await User.create({
      email,
      password,
      role: userRole,
      firstName,
      lastName,
      startYear,
      endYear,
      degree,
      branch,
      rollNumber,
      // 🔥 NAYA: secretAnswer ko lowercase karke save kar rahe hain taaki case-sensitivity ka issue na aaye
      secretAnswer: secretAnswer ? secretAnswer.toLowerCase() : "mumbai" 
    });

    // 4. Send Success Response
    res.status(201).json({
      status: "success",
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully!`,
      data: { user: newUser },
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "fail",
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = registerController;