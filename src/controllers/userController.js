import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      companyId: req.user.companyId,
      email
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      companyId: req.user.companyId,
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      message: "User created successfully",
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

export async function getUsers(req, res, next) {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
      isDeleted: false
    })
      .select("-password")
      .sort({ _id: 1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      message: "Users retrieved successfully",
      users
    });
  } catch (error) {
    next(error);
  }
}