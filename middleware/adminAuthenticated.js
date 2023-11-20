const jwt = require("jsonwebtoken");

const adminAuthenticated = (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    if (!token) {
      req.adminAuthenticated = false;
      next();
    } else {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add the decoded user to the request object
      req.adminAuthenticated = true;
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid token.");
  }
};

module.exports = adminAuthenticated;
