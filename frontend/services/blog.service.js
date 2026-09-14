import api from "@/lib/api";

export const getBlogs = (params = {}) => api.get("/blogs", { params });

export const getMyBlogs = () => api.get("/blogs/mine");

export const getBlogById = (id) => api.get(`/blogs/${id}`);

export const createBlog = (payload) => api.post("/blogs/create", payload);

export const updateBlog = (id, payload) =>
  api.put(`/blogs/update/${id}`, payload);

export const deleteBlog = (id) => api.delete(`/blogs/delete/${id}`);

export const CATEGORIES = ["Testing", "Automation", "Programming", "DevOps", "AI"];
