
import express from "express";
import rateLimit from "express-rate-limit";

import { login } from "../controllers/authController.js";
import { loginValidator } from "../validators/authValidator.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: {
    error: "Too many login attempts. Try again later."
  }
});

router.post("/login", loginLimiter, loginValidator, login);

export default router;
