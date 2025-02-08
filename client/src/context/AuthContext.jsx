import React, { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user") ?? null);
  const [token, setToken] = useState(localStorage.getItem("token") ?? null);

  const login = (value) => {
    localStorage.setItem("token", value.token);
    localStorage.setItem("user", JSON.stringify(value.user));
    setToken(value.token);
    setUser(value.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
