import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getProfile,
    updateProfile,
    updateProfileImage,
    updatePassword,
} from "../controller/users.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
    updateProfileValidation,
    updatePasswordValidation,
    statusValidation,
    idParamValidation,
} from "../utils/validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile/update", authenticate, updateProfileValidation, validate, updateProfile);
router.patch("/profile/image", authenticate, upload.single("image"), updateProfileImage);
router.patch("/password", authenticate, updatePasswordValidation, validate, updatePassword);

router.get("/", authenticate, authorize("admin"), getAllUsers);
router.get("/:id", authenticate, authorize("admin"), idParamValidation, validate, getUserById);
router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    idParamValidation,
    statusValidation,
    validate,
    updateUserStatus
);

export default router;
