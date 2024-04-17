import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpError } from "../model/httpError";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      categoryId,
      imageSrc,
      showroom,
      trim,
      year,
      kilometers,
      regionalSpecs,
      doors,
      bodyType,
      sellerType,
      transmissionType,
      horsepower,
      numberOfCylinders,
      warranty,
      exteriorColor,
      interiorColor,
      targetMarket,
      tags,
    } = req.body;

    // Check for mandatory fields
    if (!name || !description || !categoryId) {
      const err = new HttpError(
        "Name, description, and categoryId are mandatory fields.",
        400
      );
      return next(err);
    }

    const prisma = new PrismaClient();

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      const err = new HttpError("Category not found.", 404);
      return next(err);
    }

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        imageSrc,
        showroom,
        trim,
        year,
        kilometers,
        regionalSpecs,
        doors,
        bodyType,
        sellerType,
        transmissionType,
        horsepower,
        numberOfCylinders,
        warranty,
        exteriorColor,
        interiorColor,
        targetMarket,
        tags: {
          create: tags.map((tagName: string) => ({ name: tagName })),
        },
      },
    });

    // Send response with the newly created product
    res.status(201).json({ data: newProduct });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to add product, please try again later.",
      500
    );
    return next(err);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      categoryId,
      tags,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 10,
    } = req.query;

    const prisma = new PrismaClient();

    // Build query filters
    const filters: any = {};
    if (categoryId) {
      filters.categoryId = categoryId.toString();
    }
    if (tags) {
      filters.tags = { some: { name: { in: tags.toString().split(",") } } };
    }
    if (minPrice && maxPrice) {
      filters.price = {
        gte: parseInt(minPrice.toString()),
        lte: parseInt(maxPrice.toString()),
      };
    }

    // Fetch products with pagination
    const products = await prisma.product.findMany({
      where: filters,
      take: parseInt(pageSize.toString()),
      skip: (parseInt(page.toString()) - 1) * parseInt(pageSize.toString()),
    });

    // Send response with the retrieved products
    res.status(200).json({ data: products });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to fetch products, please try again later.",
      500
    );
    return next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categoryId,
      imageSrc,
      showroom,
      trim,
      year,
      kilometers,
      regionalSpecs,
      doors,
      bodyType,
      sellerType,
      transmissionType,
      horsepower,
      numberOfCylinders,
      warranty,
      exteriorColor,
      interiorColor,
      targetMarket,
      tags,
    } = req.body;

    const prisma = new PrismaClient();

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      const err = new HttpError("Product not found.", 404);
      return next(err);
    }

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existingCategory) {
      const err = new HttpError("Category not found.", 404);
      return next(err);
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        imageSrc,
        showroom,
        trim,
        year,
        kilometers,
        regionalSpecs,
        doors,
        bodyType,
        sellerType,
        transmissionType,
        horsepower,
        numberOfCylinders,
        warranty,
        exteriorColor,
        interiorColor,
        targetMarket,
        tags: {
          set: tags ? tags.map((tagName: string) => ({ name: tagName })) : [],
        },
      },
    });

    // Send response with the updated product
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to update product, please try again later.",
      500
    );
    return next(err);
  }
};

export const addTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name) {
      const err = new HttpError(
        "Name is a mandatory field for tag creation.",
        400
      );
      return next(err);
    }

    const prisma = new PrismaClient();

    // Check if tag with the same name already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });
    if (existingTag) {
      const err = new HttpError("Tag with this name already exists.", 409);
      return next(err);
    }

    // Create the tag
    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });

    // Send response with the newly created tag
    res.status(201).json({ data: newTag });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to add tag, please try again later.",
      500
    );
    return next(err);
  }
};

export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient();

    // Fetch all tags
    const tags = await prisma.tag.findMany();

    // Send response with the retrieved tags
    res.status(200).json({ data: tags });
  } catch (error) {
    // Handle errors
    const err = new HttpError(
      "Failed to fetch tags, please try again later.",
      500
    );
    return next(err);
  }
};
