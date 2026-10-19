
import User from "../models/User.js";

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
