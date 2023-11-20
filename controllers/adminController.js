// controllers/adminController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminLogin = async (req, res) => {
  res.clearCookie("token");
  try {
    const { username, password } = req.body;
    // Find user by email
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(400).send("Admin not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // User authenticated
    // Create a token
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET, // Secret key stored in environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/admin/dashboard");
    // res.status(200).send("User logged in successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error logging in admin");
  }
};
const adminLogout = (req, res) => {
  console.log("user logged out");
  res.clearCookie("token"); // Clear the authentication cookie
  res.redirect("/"); // Redirect to the homepage or login page
};
const adminDashboardView = async (req, res) => {
  const users = await User.find().populate("favorites");
  res.render("adminDashboard", { users });
};

const adminLoginView = (req, res) => {
  res.render("adminLogin", {});
};
module.exports = {
  adminLogin,
  adminLogout,
  adminDashboardView,
  adminLoginView,
};
