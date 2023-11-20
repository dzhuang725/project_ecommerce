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
      req.user = decoded; // Add the decoded user to the request object
      req.isAuthenticated = true;
      next(); // Proceed to the next middleware or route handler
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = isAuthenticated;
