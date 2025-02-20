import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  if (!token) return true; // Pas de token = expiré

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le JWT
    const exp = payload.exp * 1000; // Convertir en millisecondes
    return Date.now() >= exp; // Comparer avec l'heure actuelle
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return true; // En cas d'erreur, on considère le token comme expiré
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [token, setToken] = useState(localStorage.getItem("token") ?? null);

  useEffect(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      console.log("Token expiré, déconnexion...");
      toast.error("Votre session a expiré, veuillez vous reconnecter.");
      logout();
    } else {
      // Si le token est valide, on peut récupérer l'utilisateur (par ex: depuis le payload)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.userId, email: payload.email });
    }
  }, [token]);

  const authLogin = (value) => {
    if (!value?.token || !value?.user) {
      console.error("Données d'authentification invalides");
      return;
    }

    localStorage.setItem("token", value.token);
    localStorage.setItem("user", JSON.stringify(value.user));
    setToken(value.token);
    setUser(value.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, authLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
