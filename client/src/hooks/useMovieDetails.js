import { useState, useEffect } from "react";
import { getMovieDetails } from "../services/movieService";

const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        setError("Erreur lors de la récupération du film.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  return { movie, loading, error };
};

export default useMovieDetails;
