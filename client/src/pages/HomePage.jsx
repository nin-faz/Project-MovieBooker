import { useEffect, useState } from "react";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import Loader from "../components/Loader";

const HomePage = () => {
  useEffect(() => {
    document.title = "Accueil";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const {
    movies = [],
    totalPages,
    loading,
    error,
  } = useMovies(searchTerm, filter, page);

  if (error) {
    toast.error(error);
  }

  return (
    <div className="container mx-auto p-6 flex flex-col flex-grow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <SearchBar setSearchTerm={setSearchTerm} />
        <Filter setFilter={setFilter} />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {movies?.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            <p className="text-center col-span-full text-white">
              Aucun film trouvé
            </p>
          )}
        </div>
      )}
      <div className="flex justify-center mt-12 space-x-32">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded transition-colors duration-300 ${
            page === 1
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          }`}
        >
          Précédent
        </button>

        <p className="text-white text-lg">
          Page {page} sur {totalPages}
        </p>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded transition-colors duration-300 ${
            page >= totalPages
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default HomePage;
