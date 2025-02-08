const Filter = ({ setFilter }) => {
  return (
    <select
      className="p-3 border border-gray-700 rounded bg-gray-800 text-white"
      onChange={(e) => setFilter(e.target.value)}
    >
      <option value="">Trier par</option>
      <option value="popularity.desc">Popularité</option>
      <option value="vote_average.desc">Meilleures notes</option>
      <option value="primary_release_date.desc">Date de sortie</option>
    </select>
  );
};

export default Filter;
