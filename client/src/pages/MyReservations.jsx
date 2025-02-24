import useReservations from "../hooks/useReservations";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const MyReservations = () => {
  const { reservations, loading, error, handleDeleteReservation } =
    useReservations();

  useEffect(() => {
    document.title = "Mes réservations";
  }, []);

  if (loading) return <Loader />;
  if (error) {
    toast.error(error);
  }

  // Séparer les réservations passées et futures
  const now = new Date();

  const upcomingReservations = reservations.filter(
    (res) => new Date(res.endsAt) >= now
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        🎟️ Mes Réservations
      </h1>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500">Aucune réservation trouvée.</p>
      ) : (
        <>
          <h2 className="text-xl text-white font-semibold mt-6 mb-2">
            📅 À venir
          </h2>
          {upcomingReservations.length > 0 ? (
            <ul className="space-y-4">
              {upcomingReservations.map((res) => (
                <li
                  key={res.reservationId}
                  className="flex items-center bg-gray-900 text-white border-2 border-white p-4 rounded-lg shadow-md transition duration-200 hover:shadow-lg hover:bg-gray-800"
                >
                  <div className="ml-4 flex-1">
                    <p className="text-lg font-semibold">{res.movieTitle}</p>
                    <p className="text-sm text-gray-300">
                      🎬 <strong>Séance :</strong>{" "}
                      {new Date(res.reservedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300">
                      ⏳ <strong>Fin :</strong>{" "}
                      {new Date(res.endsAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReservation(res.reservationId)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={24} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucune réservation à venir.</p>
          )}

          {/* Réservations passées */}
          <h2 className="text-xl text-gray-400 font-semibold mt-6 mb-2">
            📜 Passées
          </h2>
          <Link
            to="/my-reservations-history"
            className="text-blue-400 hover:underline text-sm"
          >
            Voir l'historique des réservations →
          </Link>
        </>
      )}
    </div>
  );
};

export default MyReservations;
