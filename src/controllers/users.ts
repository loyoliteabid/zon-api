import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { PrismaClient, User } from "@prisma/client";
import { HttpError } from "../model/httpError";

const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (user: User) => {
  try {
    return jwt.sign({ id: user.id }, process.env.JWTSecret, {
      expiresIn: "1h",
    });
  } catch (error: any) {
    console.log("Error while generating token ", error?.message);
  }
};

// Add User function with JWT token generation
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      const err = new HttpError(
        "Username, email, and password are mandatory fields. Please try login",
        400
      );
      return next(err);
    }

    const prisma = new PrismaClient();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const err = new HttpError("User with this email already exists.", 409);
      return next(err);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the user with hashed password
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser);

    // Send response with the newly created user and token
    res.status(201).json({
      data: {
        userId: newUser?.id,
        userName: newUser?.username,
        email: newUser?.email,
        token,
      },
    });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to add user, please try again later.",
      500
    );
    return next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      const err = new HttpError(
        "Email and password are mandatory fields.",
        400
      );
      return next(err);
    }

    const prisma = new PrismaClient();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found, return error
    if (!user) {
      const err = new HttpError("Invalid email or password.", 401);
      return next(err);
    }

    // Compare hashed password
    let passwordMatch = false;
    if (user.password) {
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    // If passwords don't match, return error
    if (!passwordMatch) {
      const err = new HttpError("Invalid email or password.", 401);
      return next(err);
    }

    // Passwords match, generate JWT token
    const token = generateToken(user);

    // Send token in response
    res.status(200).json({
      data: {
        userId: user?.id,
        userName: user?.username,
        email: user?.email,
        token,
      },
    });
  } catch (error) {
    // Handle errors
    const err = new HttpError("Failed to login, please try again later.", 500);
    return next(err);
  }
};
