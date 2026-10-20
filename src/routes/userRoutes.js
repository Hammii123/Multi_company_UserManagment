
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getUsers } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticateMiddleware.js";
import { authorize } from "../middleware/roleBaseMiddleware.js";
import { createUser } from "../controllers/userController.js";



const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user
  });
});

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

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  getUsers
);

router.post(
  "/",
  authenticate,
  authorize("Admin"),
  createUser
);


export default router;
