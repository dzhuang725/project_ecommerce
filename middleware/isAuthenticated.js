const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    if (!token) {
      req.isAuthenticated = false;
      next();
    } else {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.isAuthenticated = true;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = isAuthenticated;
