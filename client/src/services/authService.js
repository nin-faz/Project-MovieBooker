import { toast } from "react-toastify";

const API_URL = "https://back-project-moviebooker.onrender.com";

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Échec de l'inscription.");
    }

    return data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error logging in");
    }

    const data = await response.json();
    return { token: data.access_token };
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur de récupération du profil");
    }

    return await response.json();
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};
