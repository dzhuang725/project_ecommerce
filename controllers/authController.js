const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//For Register Page
const registerView = (req, res) => {
  res.render("register", {});
};
// For Login page
const loginView = (req, res) => {
  res.render("login", {});
};

const registerUser = async (req, res) => {
  try {
    // TODO: Check inputs before send request
    const { name, email, location, password, confirm } = req.body;
    if (password !== confirm) {
      return res.render("error", {
        message: "Password doesnot match confirm",
      });
    }
    // Check if the user already existes
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("Email already in use");
      error.status = "400 Bad Request";
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      location,
      password: hashedPassword,
    });

    await user.save();
    res.redirect("/login");
    // res.status(201).send("User created succefully");
  } catch (error) {
    const status = error.status || 500;
    error.status = status;
    res.render("error", { message: error.message, error: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Check email and password before send request
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.status = "400 Bad Request";
      throw error;
    }

    // User authenticated
    // Create a token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Secret key stored in environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.redirect("/");
  } catch (error) {
    const status = error.status || 500;
    error.status = status;
    res.render("error", { message: error.message, error: error });
  }
};

const logout = (req, res) => {
  console.log("user logged out");
  res.clearCookie("token"); // Clear the authentication cookie
  res.redirect("/"); // Redirect to the homepage or login page
};

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logout,
};
