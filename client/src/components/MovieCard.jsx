import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md rounded-lg p-2 text-center                  transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: "145%" }}>
        <button onClick={() => navigate(`/movies/${movie.id}`)}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-md"
          />
        </button>
      </div>
      <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
      <p className="text-gray-600 ">
        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
      </p>
    </div>
  );
};

export default MovieCard;
