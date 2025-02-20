import { useState, useEffect } from "react";
import {
  fetchMovies,
  searchMovies,
  filterMovies,
} from "../services/movieService";

const useMovies = (searchQuery = "", filter = "", page = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery) {
          data = await searchMovies(searchQuery, page);
        } else if (filter) {
          data = await filterMovies(filter);
        } else {
          data = await fetchMovies(page);
        }

        setMovies(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des films :", err);
        setError("Erreur lors du chargement des films.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery, filter, page]);

  return { movies, loading, error };
};

export default useMovies;
