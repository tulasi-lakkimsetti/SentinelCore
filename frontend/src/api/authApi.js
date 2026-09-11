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