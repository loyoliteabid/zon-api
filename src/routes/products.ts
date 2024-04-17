import { Router } from "express";

import {
  addProduct,
  addTag,
  getAllProducts,
  getTags,
  updateProduct,
} from "../controllers/products";

// New Router instance
const router = Router();

// Products routes
router.get("/", getAllProducts);
router.get("/tags", getTags);
router.post("/addone", addProduct);
router.post("/addtag", addTag);
router.put("/:id", updateProduct);

export default router;
