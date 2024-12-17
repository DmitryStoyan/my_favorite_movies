import { defineStore } from "pinia";
import { useMovieStore } from "./MovieStore";
const baseUrl = "https://kinopoiskapiunofficial.tech/api/v2.2/films";
const apiKey = "2f6eeb83-efd3-414b-be83-150d1f8d8134";

export const useSearchStore = defineStore("searchStore", {
  state: () => ({
    loader: false,
    movies: [],
  }),
  actions: {
    async getMovies(search) {
      try {
        this.loader = true;
        const res = await fetch(`${baseUrl}?keyword=${search}`, {
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        this.movies = data.items;
        // console.log(data.items);
        this.movies = data.items.map((movie) => ({
          id: movie.kinopoiskId,
          original_title: movie.nameRu || movie.nameOriginal || "Untitled",
          overview: movie.description || "No description available",
          poster_path: movie.posterUrl || "/placeholder.jpg",
          release_date: movie.year || "Unknown",
        }));

        this.loader = false;
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      }
    },
    addToUserMovies(object) {
      const movieStore = useMovieStore();
      movieStore.movies.push({ ...object, isWatched: false });
      movieStore.activeTab = 1;
    },
  },
});
