import { Router } from "express";
import {
  register,
  verifyAndSetPassword,
  login,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/verify", verifyAndSetPassword);
router.post("/login", login);

export default router;
