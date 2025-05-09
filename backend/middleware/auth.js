const jwt = require("jsonwebtoken");

// authMiddleware.js
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  console.log("Incoming token:", token);
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "exists" : "missing");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ 
      message: "Token verification failed",
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
