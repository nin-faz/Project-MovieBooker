const SearchBar = ({ setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Rechercher un film..."
      className="w-full md:w-1/2 p-3 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default SearchBar;
