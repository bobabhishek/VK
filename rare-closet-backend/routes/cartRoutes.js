import { Router } from "express";
import { getMyCart, addItemToCart, removeItemFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/my", protect, getMyCart);
router.post("/items", protect, addItemToCart);
router.delete("/items/:productId", protect, removeItemFromCart);
router.delete("/clear", protect, clearCart);

export default router;


