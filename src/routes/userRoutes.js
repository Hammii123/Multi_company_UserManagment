
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createUser,
  getUsers
} from "../controllers/userController.js";

const router = express.Router();

// Get the currently authenticated user's information
router.get(
  "/me",
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      message: "Authentication successful",
      user: req.user
    });
  }
);

// Admin-only test endpoint
router.get(
  "/admin-test",
  authenticateToken,
  authorizeRoles("Admin"),
  (req, res) => {
    res.status(200).json({
      message: "Welcome, Admin!"
    });
  }
);

// Admin and Manager can view users in their own company
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getUsers
);

// Only Admin can create users
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  createUser
);

export default router;
