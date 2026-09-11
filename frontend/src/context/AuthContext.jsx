import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const [roles, setRoles] = useState(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return [];
    }

    try {
      const decoded = jwtDecode(token);
      return decoded.roles || [];
    } catch (error) {
      return [];
    }
  });

  const loginUser = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    try {
      const decoded = jwtDecode(access);
      setRoles(decoded.roles || []);
    } catch (error) {
      setRoles([]);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRoles([]);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const isAdmin = roles.includes("ROLE_ADMIN");

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        roles,
        loginUser,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};