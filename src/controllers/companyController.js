
import Company from "../models/Company.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export async function registerCompany(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { companyName, companyEmail, adminName, adminEmail, password } = req.body;

  const session = await mongoose.startSession();

  try {
    let company;
    let admin;

    await session.withTransaction(async () => {
      const hashedPassword = await bcrypt.hash(password, 12);

      [company] = await Company.create(
        [{
          name: companyName,
          email: companyEmail
        }],
        { session }
      );

      [admin] = await User.create(
        [{
          companyId: company._id,
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "Admin"
        }],
        { session }
      );
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        createdAt: company.createdAt
      },
      admin: {
        id: admin._id,
        companyId: admin.companyId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A company with this email already exists, or this user email already exists within the company."
      });
    }

    return next(error);
  } finally {
    await session.endSession();
  }
}
