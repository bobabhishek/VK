import { Router } from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, admin, getOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);

export default router;


