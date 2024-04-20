import { Router } from "express";
import { addUser, loginUser } from "../controllers/users";

// New Router instance
const router = Router();

// Users routes
router.post("/create", addUser);
router.post("/login", loginUser);

export default router;
