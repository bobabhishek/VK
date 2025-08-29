import { Router } from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;


