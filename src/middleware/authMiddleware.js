
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access token is required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "JWT_SECRET is not configured"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      !decoded.sub ||
      !mongoose.isValidObjectId(decoded.sub) ||
      !mongoose.isValidObjectId(decoded.companyId) ||
      !["Admin", "Manager", "Employee"].includes(decoded.role)
    ) {
      return res.status(401).json({
        error: "Invalid token payload"
      });
    }

    req.user = {
      id: decoded.sub,
      companyId: decoded.companyId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}
