import { NextFunction, Request, Response } from "express";
import { HttpError } from "../model/httpError";
import { PrismaClient, User } from "@prisma/client";

const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // authorization: 'Bearer token'
  if (!token) {
    const err = new HttpError("Unauthorized", 401);
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      const err = new HttpError("Unauthorized", 401);
      return next(err);
    }
    req.user = user;
    next();
  } catch (error) {
    const err = new HttpError("Unauthorized", 401);
    return next(err);
  }
};

export default authenticateToken;
