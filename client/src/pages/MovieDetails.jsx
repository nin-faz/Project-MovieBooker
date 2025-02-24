import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMovieDetails from "../hooks/useMovieDetails";
import { createReservation } from "../services/reservationService";
import Calendar from "../components/Calendar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const MovieDetails = () => {
  const { movieId } = useParams();

  const navigate = useNavigate();
  const { movie, loading, error } = useMovieDetails(movieId);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  const handleReservation = async () => {
    if (!selectedDate) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }
    setIsReserving(true);

    try {
      await createReservation(Number(movieId), selectedDate);
      toast.success("Réservation confirmée !");
      navigate("/my-reservations");
    } catch (err) {
      console.log(err);

      toast.error(err.message);
    } finally {
      setIsReserving(false);
    }
  };

  useEffect(() => {
    if (movie && movie.title) {
      document.title = `${movie.title} - Détails du film`;
    }
  }, [movie]);

  if (loading) return <Loader />;
  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white py-10">
      <div className="max-w-4xl mx-auto bg-gray-700 p-6 rounded-lg shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="top-5 left-5 text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <FaArrowLeft size={30} />
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">{movie.title}</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <img
            src={
              movie.poster
                ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                : "/default-poster.jpg"
            }
            alt={movie.title}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg mb-4 md:mb-0"
            onError={(e) => (e.target.src = "/default-poster.jpg")}
          />

          <div className="flex flex-col items-start w-full md:w-1/2 md:ml-6">
            <p className="text-lg mb-4">{movie.description}</p>
            <h2 className="text-xl font-semibold mb-4">Réserver une séance</h2>
            <Calendar onSelectDate={setSelectedDate} />
            <button
              onClick={handleReservation}
              disabled={isReserving}
              className="mt-6 py-2 px-4 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors duration-300"
            >
              {isReserving ? "Réservation..." : "Réserver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
