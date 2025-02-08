const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-2 text-center">
      <div className="relative w-full" style={{ paddingBottom: "145%" }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-md"
        />
      </div>
      <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
      <p className="text-gray-600 ">
        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
      </p>
    </div>
  );
};

export default MovieCard;
