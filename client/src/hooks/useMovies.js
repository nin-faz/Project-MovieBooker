import { useState, useEffect } from "react";
import {
  fetchMovies,
  searchMovies,
  filterMovies,
} from "../services/movieService";

const useMovies = (searchQuery = "", filter = "", page = 1) => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
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
          data = await filterMovies(filter, page);
        } else {
          data = await fetchMovies(page);
        }

        console.log("Total Pages:", data.totalPages);

        setMovies(data.results || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Erreur lors du chargement des films :", err);
        setError("Erreur lors du chargement des films.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery, filter, page]);

  return { movies, totalPages, loading, error };
};

export default useMovies;
