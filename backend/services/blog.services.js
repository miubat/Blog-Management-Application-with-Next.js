import { Op } from "sequelize";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

const AUTHOR_ATTRIBUTES = ["id", "firstname", "lastname"];

export const createBlog = async ({ userId, blogTitle, blog, category }) => {
    return Blog.create({ userId, blogTitle, blog, category });
};

export const findBlogs = async ({ title, category }) => {
    const where = {};
    if (title) where.blogTitle = { [Op.like]: `%${title}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };

    return Blog.findAll({
        where,
        include: [{ model: User, as: "author", attributes: AUTHOR_ATTRIBUTES }],
        order: [["createAt", "DESC"]],
    });
};

export const findBlogById = async (id) => {
    return Blog.findByPk(id, {
        include: [{ model: User, as: "author", attributes: AUTHOR_ATTRIBUTES }],
    });
};

export const updateBlogById = async (id, requester, { blogTitle, blog, category }) => {
    const existingBlog = await Blog.findByPk(id);
    if (!existingBlog) {
        const error = new Error("Blog not found");
        error.statusCode = 404;
        throw error;
    }

    if (requester.role !== "admin" && existingBlog.userId !== requester.id) {
        const error = new Error("You are not authorized to update this blog");
        error.statusCode = 403;
        throw error;
    }

    if (blogTitle !== undefined) existingBlog.blogTitle = blogTitle;
    if (blog !== undefined) existingBlog.blog = blog;
    if (category !== undefined) existingBlog.category = category;

    await existingBlog.save();
    return existingBlog;
};

export const deleteBlogById = async (id, requester) => {
    const existingBlog = await Blog.findByPk(id);
    if (!existingBlog) {
        const error = new Error("Blog not found");
        error.statusCode = 404;
        throw error;
    }

    if (requester.role !== "admin" && existingBlog.userId !== requester.id) {
        const error = new Error("You are not authorized to delete this blog");
        error.statusCode = 403;
        throw error;
    }

    await existingBlog.destroy();
};
