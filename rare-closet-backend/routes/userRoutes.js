import { Router } from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, admin, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;


