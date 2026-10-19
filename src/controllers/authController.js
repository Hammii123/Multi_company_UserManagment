
import Company from "../models/Company.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export async function login(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { companyEmail, email, password } = req.body;

  try {
    // Find the company first
    const company = await Company.findOne({
      email: companyEmail
    }).lean();

    if (!company) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    // Find the user inside this company
    const user = await User.findOne({
      companyId: company._id,
      email,
      isDeleted: false
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        companyId: String(user.companyId),
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        subject: String(user._id),
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        companyId: user.companyId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}
