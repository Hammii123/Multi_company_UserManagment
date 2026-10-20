
import Company from "../models/Company.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";


export async function registerCompany(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    companyName,
    companyEmail,
    adminName,
    adminEmail,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const company = await Company.create({
      name: companyName,
      email: companyEmail,
    });

    const admin = await User.create({
      companyId: company._id,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      admin: {
        id: admin._id,
        companyId: admin.companyId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error:
          "A company with this email already exists, or this user email already exists.",
      });
    }

    next(error);
  }
}