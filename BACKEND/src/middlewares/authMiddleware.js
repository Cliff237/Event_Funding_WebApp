import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  // console.log('Auth middleware triggered for path:', req.path);
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No or invalid Authorization header');
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  // console.log('Token received, verifying...');
  
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token verified successfully. User:', decoded);
    
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ 
      message: "Invalid or expired token",
      error: error.message 
    });
  }
};

// Role check middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
