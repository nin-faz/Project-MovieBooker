import { toast } from "react-toastify";

const API_URL = "https://back-project-moviebooker.onrender.com";

export const createReservation = async (movieId, reservedAt) => {
  try {
    const token = localStorage.getItem("token");

    if (!movieId || isNaN(movieId)) {
      throw new Error("movieId est invalide !");
    }
    const response = await fetch(`${API_URL}/reservation/${Number(movieId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId, reservedAt }),
    });

    if (!response.ok) {
      // Extraire le message d'erreur du backend, s'il y en a
      const errorData = await response.json();
      const errorMessage =
        errorData?.message || "Impossible de réserver ce créneau";
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (err) {
    console.error("Erreur lors de la réservation :", err);
    throw err;
  }
};

export const getMyReservations = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/my-reservations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Erreur lors de la récupération des réservations"
      );
    }

    return response.json();
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations :", err);
    throw err;
  }
};

export const deleteReservation = async (reservationId) => {
  try {
    if (!reservationId || isNaN(reservationId)) {
      throw new Error("ID de réservation invalide !");
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/my-reservations/${Number(reservationId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Erreur lors de la suppression");
    }

    toast.success("Réservation supprimée !");

    return response.json();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    throw err;
  }
};
