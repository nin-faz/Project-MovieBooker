const API_URL = "https://back-project-moviebooker.onrender.com";

export const fetchMovies = async (page = 1) => {
  const res = await fetch(`${API_URL}/movies?page=${page}`);
  const data = await res.json();
  return data.results;
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
    return data.results || [];
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return [];
  }
};

export const filterMovies = async (sort) => {
  const res = await fetch(`${API_URL}/discover/movie?sort=${sort}`);
  return res.json();
};
