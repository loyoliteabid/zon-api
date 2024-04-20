import express from "express";
import { Request, Response, NextFunction } from "express";

import categories from "./routes/categories";
import products from "./routes/products";
import users from "./routes/users";
import { HttpError } from "./model/httpError";

const app = express();
const port = process.env.PORT || 3999;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.all("/", (req, res) => {
  res.status(200).send("Success");
}); //GET or POST or any other verb on / will be handled here

// APIs
app.use("/categories", categories);
app.use("/products", products);
app.use("/users", users);

app.use((/*req, res, next*/) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error handling middleware
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
