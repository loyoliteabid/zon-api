import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import { HttpError } from "../model/httpError";

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, imageSrc } = req.body;

    const prisma = new PrismaClient();

    const savedCategory = await prisma.category.create({
      data: { name, imageSrc },
    });
    if (savedCategory) {
      // send response
      res
        .status(201)
        .json({ message: `Successfully added category ${savedCategory.name}` });
    } else {
      const err = new HttpError("Something went wrong.", 500);
      return next(err);
    }
  } catch (error) {
    const err = new HttpError(
      "Adding category failed, please try again later.",
      500
    );
    return next(err);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();

    // Fetch all categories
    const categories = await prisma.category.findMany();

    // Send response with the retrieved categories
    res.status(200).json({ data: categories });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to fetch categories, please try again later.",
      500
    );
    return next(err);
  }
};

export const updateCategoryName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const prisma = new PrismaClient();

    // Update the category name
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    // Send response with the updated category
    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to update category name, please try again later.",
      500
    );
    return next(err);
  }
};
