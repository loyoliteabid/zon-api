import { Router } from "express";

import {
  addCategory,
  getAllCategories,
  updateCategoryName,
} from "../controllers/categories";

// New Router instance
const router = Router();

// Categories routes
router.get("/", getAllCategories);
router.post("/addone", addCategory);
router.patch("/:id", updateCategoryName);

export default router;
