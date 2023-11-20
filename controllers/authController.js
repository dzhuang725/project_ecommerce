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
    if (!name || !email || !password || !confirm) {
      console.log("Fill empty fields");
      return res.render("register", {
        name,
        email,
        password,
        confirm,
      });
    }
    // Check if the user already existes
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("Email alrealy in use");
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
    console.log(error);
    res.status(500).send("Error registering new user");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Check email and password before send request
    // if (!email || !password) {
    //   console.log("Please fill in all the fields");
    //   return res.render("login", {
    //     email,
    //     password,
    //   });
    // }
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
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
    // res.status(200).send("User logged in successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error logging in user");
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
