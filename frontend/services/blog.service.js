import api from "@/lib/api";

// Backend has no dedicated "my blogs" endpoint — GET /blogs returns every
// blog (optionally filtered by title/category), so "My Blogs" is this same
// list filtered client-side by author id (see dashboard/blogs/page.jsx).
export const getBlogs = (params = {}) => api.get("/blogs", { params });

export const getBlogById = (id) => api.get(`/blogs/${id}`);

export const createBlog = (payload) => api.post("/blogs/create", payload);

export const updateBlog = (id, payload) =>
  api.put(`/blogs/update/${id}`, payload);

export const deleteBlog = (id) => api.delete(`/blogs/delete/${id}`);

export const CATEGORIES = ["Testing", "Automation", "Programming", "DevOps", "AI"];
