import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controller/auth.controller.js";
import {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../utils/validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.patch("/reset-password/:token", resetPasswordValidation, validate, resetPassword);

export default router;
