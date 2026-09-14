import api from "@/lib/api";

export const getProfile = () => api.get("/users/profile");

export const updateProfile = (payload) =>
  api.put("/users/profile/update", payload);

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.patch("/users/profile/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const changePassword = (password) =>
  api.patch("/users/password", { password });

export const getAllUsers = (params = {}) => api.get("/users", { params });

export const getUserById = (id) => api.get(`/users/${id}`);

export const setUserStatus = (id, isActive) =>
  api.patch(`/users/${id}/status`, { isActive });
