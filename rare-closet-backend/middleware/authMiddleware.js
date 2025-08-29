import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Extract token from common locations to be Postman-friendly
const extractBearerToken = (req) => {
  // Standard Authorization header: "Bearer <token>"
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && typeof authHeader === "string") {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }
    // If someone sends just the raw token in Authorization
    if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(authHeader)) {
      return authHeader;
    }
  }

  // Alternate headers some clients use
  const altHeaders = [
    "x-access-token",
    "x-auth-token",
    "token",
  ];
  for (const key of altHeaders) {
    const candidate = req.headers && req.headers[key];
    if (typeof candidate === "string" && candidate.trim()) {
      if (candidate.startsWith("Bearer ")) return candidate.split(" ")[1];
      return candidate.trim();
    }
  }

  // Query param fallback (?token=...)
  if (req.query && typeof req.query.token === "string" && req.query.token.trim()) {
    return req.query.token.trim();
  }

  return null;
};

export const protect = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  res.status(403).json({ message: "Admin access only" });
};


