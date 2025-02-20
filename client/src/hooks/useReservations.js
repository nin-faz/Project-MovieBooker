import { useState, useEffect } from "react";
import {
  deleteReservation,
  getMyReservations,
} from "../services/reservationService";

const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getMyReservations();
        setReservations(data);
      } catch (err) {
        setError("Erreur lors du chargement des réservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
      setReservations((prev) =>
        prev.filter((res) => res.reservationId !== reservationId)
      );
    } catch (err) {
      setError("Erreur lors de la suppression de la réservation.");
    }
  };

  return { reservations, loading, error, handleDeleteReservation };
};

export default useReservations;
