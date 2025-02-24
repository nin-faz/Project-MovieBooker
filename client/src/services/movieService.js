const API_URL = "https://back-project-moviebooker.onrender.com";

export const fetchMovies = async (page = 1) => {
  try {
    const res = await fetch(`${API_URL}/movies?page=${page}`);
    if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return { results: [], totalPages: 1 };
  }
};

export const searchMovies = async (title, page = 1) => {
  try {
    const res = await fetch(
      `${API_URL}/search/movie?title=${title}&page=${page}`
    );
    if (!res.ok) {
      throw new Error(`Erreur HTTP : ${res.status}`);
    }
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return { results: [], totalPages: 1 };
  }
};

export const filterMovies = async (sort, page = 1) => {
  try {
    const res = await fetch(
      `${API_URL}/discover/movie?sort=${sort}&page=${page}`
    );
    const data = await res.json();

    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return { results: [], totalPages: 1 };
  }
};

export const getMovieDetails = async (movieId) => {
  const response = await fetch(`${API_URL}/movie/${movieId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du film");
  }
  return response.json();
};
