const jwt = require("jsonwebtoken");

// Middleware function to verify JWT in request headers
const verifyJWT = (req, res, next) => {
  // Extract authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if authorization header is missing or doesn't start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Extract token from authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using the access token secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      throw new Error("Token verification failed");
    }

    // Store decoded user ID in request object for use in subsequent middleware or routes
    req.userId = decodedToken.userId;

    // Call next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Export the middleware function for use in other modules
module.exports = verifyJWT;
