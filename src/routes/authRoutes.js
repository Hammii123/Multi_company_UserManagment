
import express from "express";
import { login } from "../controllers/authController.js";
import { loginValidator } from "../validators/authValidator.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    error: "Too many login attempts. Please try again later."
  }
});

router.post("/login", loginLimiter, loginValidator, login);

export default router;
