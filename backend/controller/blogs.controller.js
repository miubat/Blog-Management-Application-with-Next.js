import * as blogService from "../services/blog.services.js";

export const createBlog = async (req, res) => {
    try {
        const { blogTitle, blog, category } = req.body;
        const newBlog = await blogService.createBlog({
            userId: req.user.id,
            blogTitle,
            blog,
            category,
        });
        res.status(201).json({ message: "Blog created successfully", data: newBlog });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const { title, category, page, limit } = req.query;
        const result = await blogService.findBlogs({ title, category, page, limit });
        res.status(200).json({ message: "Blogs retrieved successfully", data: result });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getMyBlogs = async (req, res) => {
    try {
        const blogs = await blogService.findBlogsByUser(req.user.id);
        res.status(200).json({ message: "Your blogs retrieved successfully", data: blogs });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await blogService.findBlogById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog retrieved successfully", data: blog });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await blogService.updateBlogById(req.params.id, req.user, req.body);
        res.status(200).json({ message: "Blog updated successfully", data: updatedBlog });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await blogService.deleteBlogById(req.params.id, req.user);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Server error" });
    }
};
