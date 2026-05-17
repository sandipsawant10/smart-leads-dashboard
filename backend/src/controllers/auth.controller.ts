import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { asyncHandler, AppError } from "../middleware/error";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("User already exists", 400);
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token },
    });
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const userObj = user.toJSON();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user: userObj, token },
    });
  },
);

export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as Request & { user?: { userId: string } }).user
      ?.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: { user },
    });
  },
);
