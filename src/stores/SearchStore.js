import { defineStore } from "pinia";
import { useMovieStore } from "./MovieStore";
import { ref } from "vue";
const baseUrl = "https://kinopoiskapiunofficial.tech/api/v2.2/films";
const apiKey = "2f6eeb83-efd3-414b-be83-150d1f8d8134";

export const useSearchStore = defineStore("searchStore", () => {
  const loader = ref(false);
  const movies = ref([]);

  const getMovies = async (search) => {
    try {
      loader.value = true;
      const res = await fetch(`${baseUrl}?keyword=${search}`, {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      movies.value = data.items;
      movies.value = data.items.map((movie) => ({
        id: movie.kinopoiskId,
        original_title: movie.nameRu || movie.nameOriginal || "Untitled",
        overview: movie.description || "No description available",
        poster_path: movie.posterUrl || "/placeholder.jpg",
        release_date: movie.year || "Unknown",
      }));

      loader.value = false;
    } catch (error) {
      console.error("Error fetching movies:", error.message);
    }
  };

  const addToUserMovies = (object) => {
    const movieStore = useMovieStore();
    movieStore.movies.push({ ...object, isWatched: false });
    movieStore.activeTab = 1;
  };

  return {
    loader,
    movies,
    getMovies,
    addToUserMovies,
  };
});
