const jwt = require("jsonwebtoken");

// Middleware function to verify JWT in request headers
const verifyJWT = (req, res, next) => {
  // Extract authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if authorization header is missing or doesn't start with "Bearer "
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract token from authorization header
  const token = authHeader.split(" ")[1];

  // Verify token using the access token secret
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // If error occurs during token verification, return forbidden
    if (err) return res.status(403).json({ message: "Forbidden" });

    // Attach decoded emailId to request object for further processing
    req.emailId = decoded.UserInfo.emailId;

    // Call the next middleware or route handler
    next();
  });
};

// Export the middleware function for use in other modules
module.exports = verifyJWT;
