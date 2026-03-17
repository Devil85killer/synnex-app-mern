const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    let { email, password, role } = req.body;
    console.log("Login Attempt:", req.body);

    // Agar frontend se 'faculty' aaye ya 'teacher', dono ko handle kar lenge
    if (role === "faculty") role = "teacher";

    // DB mein user check kar rahe hain (ab ek hi User model sab handle karega)
    const user = await User.findOne({
      email: email,
      // Hum direct role match bhi kar sakte hain, par kabhi-kabhi roles DB me alag save hote hain.
      // Isliye better hai pehle sirf email se user dhundhein.
    });

    // 1. User exist karta hai ya nahi?
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found with this email",
      });
    }

    // 2. Role match kar raha hai ya nahi? (Student, Alumni, Teacher, Admin)
    // (Allowing interchangeability for 'teacher' and 'faculty' just in case)
    if (user.role !== role && !(user.role === 'faculty' && role === 'teacher')) {
        return res.status(401).json({
            status: "fail",
            message: `Account exists, but not as a ${role}. Please select the correct role.`,
        });
    }

    // 3. Approval Check (Agar alumni/admin ko approval chahiye hota hai)
    if (user.isApproved === false) {
      return res.status(403).json({
        status: "fail",
        message: "Account not approved. Please contact the administrator for assistance.",
      });
    }

    // 4. Password Check (Note: Production me bcrypt use karna chahiye, par abhi strict match rakh rahe hain)
    if (user.password !== password) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    }

    // 5. Token Generation
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 6. Cookie set karna
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    // 7. Success Response
    res.status(200).json({
      status: "success",
      user: user, // Frontend ka payload ab seedha 'user' object uthayega
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
        status: "error",
        message: "Server encountered an error during login"
    });
  }
};

module.exports = loginController;