import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";
import { handleValidationErrors } from "../middleware/validate";

const router = Router();

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.get("/me", protect, getMe);

export default router;
