import { body, param } from "express-validator";

export const registerValidation = [
    body("firstname").trim().notEmpty().withMessage("Firstname is required"),
    body("lastname").trim().notEmpty().withMessage("Lastname is required"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
];

export const resetPasswordValidation = [
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

export const updateProfileValidation = [
    body("firstname").optional().trim().notEmpty().withMessage("Firstname cannot be empty"),
    body("lastname").optional().trim().notEmpty().withMessage("Lastname cannot be empty"),
];

export const updatePasswordValidation = [
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

export const statusValidation = [
    body("isActive").isBoolean().withMessage("isActive must be a boolean value"),
];

export const createBlogValidation = [
    body("blogTitle").trim().notEmpty().withMessage("Blog title is required"),
    body("blog").trim().notEmpty().withMessage("Blog content is required"),
    body("category").optional().trim(),
];

export const updateBlogValidation = [
    body("blogTitle").optional().trim().notEmpty().withMessage("Blog title cannot be empty"),
    body("blog").optional().trim().notEmpty().withMessage("Blog content cannot be empty"),
    body("category").optional().trim(),
];

export const idParamValidation = [
    param("id").isInt({ min: 1 }).withMessage("Invalid id"),
];
