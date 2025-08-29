import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
// Use dynamic imports to reliably get default router exports across package boundaries
// Resolve absolute paths and import via file:// URLs within the same package
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productPath = path.resolve(__dirname, "./routes/productRoutes.js");
const orderPath = path.resolve(__dirname, "./routes/orderRoutes.js");
const userPath = path.resolve(__dirname, "./routes/userRoutes.js");
const cartPath = path.resolve(__dirname, "./routes/cartRoutes.js");
const productRoutesModule = await import(pathToFileURL(productPath).href);
const orderRoutesModule = await import(pathToFileURL(orderPath).href);
const userRoutesModule = await import(pathToFileURL(userPath).href);
const cartRoutesModule = await import(pathToFileURL(cartPath).href);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Rare Closet Backend is running 🚀");
});

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rarecloset";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

// Resolve Router helpers to handle different export styles
const resolveRouter = (mod) => {
  if (!mod) return null;
  if (typeof mod === "function") return mod;
  if (typeof mod.default === "function") return mod.default;
  if (typeof mod.router === "function") return mod.router;
  return null;
};

const productRoutes = resolveRouter(productRoutesModule);
const orderRoutes = resolveRouter(orderRoutesModule);
const userRoutes = resolveRouter(userRoutesModule);
const cartRoutes = resolveRouter(cartRoutesModule);

console.log("[debug] route module keys:", {
  product: Object.keys(productRoutesModule || {}),
  order: Object.keys(orderRoutesModule || {}),
  user: Object.keys(userRoutesModule || {}),
  cart: Object.keys(cartRoutesModule || {}),
});
console.log("[debug] route module typeofs:", {
  productDefault: typeof (productRoutesModule && productRoutesModule.default),
  orderDefault: typeof (orderRoutesModule && orderRoutesModule.default),
  userDefault: typeof (userRoutesModule && userRoutesModule.default),
  cartDefault: typeof (cartRoutesModule && cartRoutesModule.default),
});
console.log("[debug] resolved paths exist:", {
  productPath,
  productExists: fs.existsSync(productPath),
  orderPath,
  orderExists: fs.existsSync(orderPath),
  userPath,
  userExists: fs.existsSync(userPath),
  cartPath,
  cartExists: fs.existsSync(cartPath),
});

if (!productRoutes) throw new Error("Invalid export from productRoutes.js: expected a Router function");
if (!orderRoutes) throw new Error("Invalid export from orderRoutes.js: expected a Router function");
if (!userRoutes) throw new Error("Invalid export from userRoutes.js: expected a Router function");
if (!cartRoutes) throw new Error("Invalid export from cartRoutes.js: expected a Router function");

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Error handlers
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
