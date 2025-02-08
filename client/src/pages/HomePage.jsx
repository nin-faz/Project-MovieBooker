import { useState, useEffect } from "react";
import {
  fetchMovies,
  searchMovies,
  filterMovies,
} from "../services/movieService";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Fonction pour charger les données selon la situation
    const loadMovies = async () => {
      try {
        let data;
        if (searchTerm) {
          data = await searchMovies(searchTerm, page); // Rechercher des films
        } else if (filter) {
          data = await filterMovies(filter); // Filtrer les films
        } else {
          data = await fetchMovies(page); // Films populaires
        }
        setMovies(data || []); // Mets à jour l'état avec les résultats
      } catch (err) {
        console.error("Erreur lors du chargement des films :", err);
        setMovies([]);
      }
    };

    loadMovies();
  }, [searchTerm, filter, page]);

  return (
    <div className="container mx-auto p-6 flex flex-col flex-grow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <SearchBar setSearchTerm={setSearchTerm} />
        <Filter setFilter={setFilter} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-center col-span-full text-white">
            Aucun film trouvé
          </p>
        )}
      </div>
      <div className="flex justify-center mt-12 space-x-32">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors duration-300"
        >
          Précédent
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors duration-300"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default HomePage;
