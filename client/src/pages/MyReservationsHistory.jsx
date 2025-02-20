import useReservations from "../hooks/useReservations";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const MyReservationsHistory = () => {
  const { reservations, loading } = useReservations();

  if (loading) return <Loader />;

  const now = new Date();
  const pastReservations = reservations.filter(
    (res) => new Date(res.endsAt) < now
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        📜 Réservations Passées
      </h1>

      <Link to="/my-reservations" className="text-blue-400 hover:underline">
        ← Retour à Mes Réservations
      </Link>

      {pastReservations.length > 0 ? (
        <ul className="space-y-4 mt-4">
          {pastReservations.map((res) => (
            <li
              key={res.reservationId}
              className="flex items-center bg-gray-800 text-gray-400 border-2 border-gray-600 p-4 rounded-lg shadow-md opacity-70"
            >
              <div className="ml-4 flex-1">
                <p className="text-lg font-semibold">{res.movieTitle}</p>
                <p className="text-sm text-gray-400">
                  🎬 <strong>Séance :</strong>{" "}
                  {new Date(res.reservedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  ⏳ <strong>Fin :</strong>{" "}
                  {new Date(res.endsAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          Aucune réservation passée.
        </p>
      )}
    </div>
  );
};

export default MyReservationsHistory;
