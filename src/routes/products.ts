import { Router } from "express";

import { addProduct, getAllProducts } from "../controllers/products";

// New Router instance
const router = Router();

// Products routes
router.get("/", getAllProducts);
router.post("/addone", addProduct);

export default router;
