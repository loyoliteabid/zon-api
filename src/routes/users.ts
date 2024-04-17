import { Router, Request, Response } from "express";

// New Router instance
const router = Router();

// Users routes
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Users" });
});

export default router;
