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
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const search = req.query.search?.trim();

    const filter = {
      companyId: req.user.companyId,
      isDeleted: false
    };

    const {role} = req.query;

    if(role){
        if(!["Admin","Manager","Employee"].includes(role)){
            return res.status(400).json({
                error:"Invalid role filter"
            });
        }
        filter.role = role;
    }


    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } }
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      message: "Users retrieved successfully",
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
      },
      users
    });
  } catch (error) {
    next(error);
  }
}



export async function updateUser(req, res,next){
    try{
        const {id} = req.params;
        const {name,email,password,role} = req.body;

        const updates = {};

        if(name !==undefined) {
            if(typeof name != "string"|| !name.trim()){
                return res.status(400).json({
                    error:"Name must be a non-empty string"
                });
            }
            updates.name = name.trim();

        }

        if(email !== undefined){
            if(  typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ) {
                return res.status(400).json({ error:"Avalid email is required"});
            }
            updates.email = email.trim().toLowerCase();
        }

        if(password !== undefined){
            if( typeof password !== "string" || password.length < 8 || password.length>72) {
                return res.status(400).json({ error: "Password must be between 8 to 72 characters"});
            }
            updates.password = await bcrypt.hash(password,12);
        }
        if (role !==undefined) {
            if(!["Admin","Manager","Employee"].includes(role)){
                return res.status(400).json({ error: "invalid role"});
            }
            updates.role= role;
        }

        if(Object.keys(updates).length === 0 ){
            return res.status(400).json({
                error:"Provide at least one field to update"
            });
        }

        const user = await User.findOneAndUpdate(
            {
                _id: id,
                companyId: req.user.companyId,
                isDeleted:false
            },
            {$set:updates},
            {
                new:true,
                runValidators: true

            }
        ).select("-password");

        if(!user){
            return res.status(400).json({
                error:"User not found in your company", 
            });
        }

        return res.status(200).json({
            message:"User updated successfully", user
        });
    }  catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error:"Invalid user ID"
            });
        }
        next(error);
    }
}

export async function deleteUser(req,res, next) {
    try{
     const {id}  = req.params;

     const user = await User.findOneAndUpdate(
        {
            _id:id,
            companyId:req.user.companyId,
            isDeleted:false
        },
        {
            $set: { isDeleted: true}
        } , 
        {
            new: true
        },

     ).select("-password");

     if(!user){
        return res.status(404).json({
            error:"User not found in your company"
        });
     }
     return res.status(200).json({
        message:"User deleted successfully", user
     });
    } catch (error) {

        if(error.name === "CastError") {
            return res.status(400).json({
                error:"Invalid user ID"
            });
        }

        next(error);

    }
}