import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

export const login = (username, password) => {
  return axios.post(`${API_BASE}/login`, {
    username,
    password
  });
};

export const refreshAccessToken = (refreshToken) => {
  return axios.post(`${API_BASE}/refresh`, {
    refreshToken
  });
};
// Get current user profile
export const getCurrentUser = () => {
  return API.get("/auth/me");
};

// Update name and email
export const updateProfile = (profileData) => {
  return API.put("/auth/profile", profileData);
};

// Change password
export const changePassword = (passwordData) => {
  return API.put("/auth/password", passwordData);
};