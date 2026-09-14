import { Router } from "express";
import {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from "../controller/blogs.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    createBlogValidation,
    updateBlogValidation,
    idParamValidation,
} from "../utils/validators.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/create", authenticate, createBlogValidation, validate, createBlog);
router.get("/", getAllBlogs);
router.get("/mine", authenticate, getMyBlogs);
router.get("/:id", idParamValidation, validate, getBlogById);
router.put("/update/:id", authenticate, idParamValidation, updateBlogValidation, validate, updateBlog);
router.delete("/delete/:id", authenticate, idParamValidation, validate, deleteBlog);

export default router;
