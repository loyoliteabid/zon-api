import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpError } from "../model/httpError";

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: encrypt password
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      const err = new HttpError(
        "Username, email, and password are mandatory fields.",
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

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password, // Note: You should hash the password before storing it in a production environment
      },
    });

    // Send response with the newly created user
    res.status(201).json({ newUser });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to add user, please try again later.",
      500
    );
    return next(err);
  }
};
