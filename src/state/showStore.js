/* fetch & simpan data dari TMDB (API) */
// src/state/showStore.js
import { create } from "zustand";
import {
  // Movies
  getGuestRatedMovies, getPopularMovies, getTrendingMovies, getUpcomingMovies,
  getMovieReleaseDates, pickCertification, getMovieRecommendations,
  // TV
  getGuestRatedTV, getPopularTV, getTrendingTV, getTVAiringToday, getTVRecommendations,
  // Common
  createGuestSession, mapTmdbToCard, getMovieGenres, getTVGenres,
} from "../utils/tmdbService";

export const useShowStore = create((set, get) => ({
  // ==== shared ====
  loading: false,
  error: null,
  genresMovieMap: {},
  genresTVMap: {},
  guestId: localStorage.getItem("tmdb.guest_session_id") || null,

  // ==== MOVIE rows ====
  movieRecommended: [],      // array of recommendations
  movieRated: [],
  moviePopular: [],
  movieTrending: [],
  movieReleaseCerts: [],
  movieUpcoming: [],

  // ==== TV rows ====
  tvRecommended: [],         // array of recommendations
  tvRated: [],
  tvPopular: [],
  tvTrending: [],
  tvAiringToday: [],

  // ===== helpers =====
    ensureGuest: async () => {
      let guestId = localStorage.getItem("tmdb.guest_session_id");
      if (guestId) {
        set({ guestId });
        return guestId;
      }
      
      // Create a new guest session if none exists
      try {
        const gs = await createGuestSession();
        guestId = gs?.guest_session_id || null;
        set({ guestId });
        return guestId;
      } catch (error) {
        console.error("Failed to create guest session:", error.message);
        set({ guestId: null });
        return null;
      }
    },

  preloadGenres: async () => {
    try {
      const [mg, tg] = await Promise.all([getMovieGenres(), getTVGenres()]);
      const movieMap = Object.fromEntries(mg.map(g => [g.id, g.name]));
      const tvMap = Object.fromEntries(tg.map(g => [g.id, g.name]));
      set({ genresMovieMap: movieMap, genresTVMap: tvMap });
    } catch (e) {
      console.warn("Genre preload failed", e?.message);
    }
  },

  // ===== MOVIE fetchers =====
  fetchMovieRows: async () => {
    const ac = new AbortController();
    set({ loading: true, error: null });

    const { genresMovieMap } = get();
    try {
      // Get popular movies to use for recommendations
      const popRes = await getPopularMovies(1, ac.signal);
      const popularMovies = (popRes?.results || []).map(m => mapTmdbToCard(m, "film"));
      
      // Get recommendations based on popular movies
      let recommendations = [];
      if (popularMovies.length > 0) {
        try {
          // Get recommendations based on the first popular movie
          const recRes = await getMovieRecommendations(popularMovies[0].id, 1, ac.signal);
          recommendations = (recRes?.results || []).slice(0, 10).map(m => mapTmdbToCard(m, "film"));
        } catch (error) {
          console.error("Error fetching movie recommendations:", error);
          // Fallback to popular movies if recommendations fail
          recommendations = popularMovies.slice(0, 10);
        }
      }

      // rated (guest)
            const guestId = await get().ensureGuest();
            let rated = [];
            if (guestId) {
              try {
                const ratedRes = await getGuestRatedMovies(guestId, 1, ac.signal);
                rated = (ratedRes?.results || []).map(m => mapTmdbToCard(m, "film"));
              } catch (error) {
                console.warn("Failed to fetch guest rated movies:", error.message);
                // Clear invalid guest session
                localStorage.removeItem("tmdb.guest_session_id");
                set({ guestId: null });
              }
            }

      // trending
      const trRes = await getTrendingMovies("day", 1, ac.signal);
      const popular = popularMovies;
      const trending = (trRes?.results || []).map(m => mapTmdbToCard(m, "film"));

      // release certifications (ambil dari 10 popular teratas)
      const topForRelease = popRes?.results?.slice(0, 10) || [];
      const certRows = [];
      for (const m of topForRelease) {
        const rd = await getMovieReleaseDates(m.id, ac.signal);
        const cert = pickCertification(rd, "US"); // ubah "ID" kalau mau
        certRows.push({ ...mapTmdbToCard(m, "film"), age: cert || undefined });
      }

      // sematkan nama genre (opsional)
      const addGenreName = (arr) => arr.map(it => {
        const firstId = Array.isArray(it.genre) ? it.genre[0] : it.genre;
        const name = genresMovieMap[firstId] ?? it.genre;
        return { ...it, genre: name };
      });

      // upcoming
      const upRes = await getUpcomingMovies(1, ac.signal);
      const upcoming = (upRes?.results || []).map(m => mapTmdbToCard(m, "film"));

      set({
        movieRecommended: addGenreName(recommendations),
        movieRated: addGenreName(rated),
        moviePopular: addGenreName(popular),
        movieTrending: addGenreName(trending),
        movieReleaseCerts: addGenreName(certRows),
        movieUpcoming: addGenreName(upcoming),
      });

      // Log if TMDB key is missing in production
      if (!import.meta.env.VITE_TMDB_KEY) {
        console.warn("VITE_TMDB_KEY is not set. API calls will fail.");
      }
    } catch (e) {
      set({ error: e?.message || "Gagal memuat data movie" });
    } finally {
      set({ loading: false });
      ac.abort(); // Abort after the operation is complete
    }
  },

  // ===== TV fetchers =====
  fetchTVRows: async () => {
    const ac = new AbortController();
    set({ loading: true, error: null });

    const { genresTVMap } = get();
    try {
      // Get popular TV shows to use for recommendations
      const popRes = await getPopularTV(1, ac.signal);
      const popularTV = (popRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));
      
      // Get recommendations based on popular TV shows
      let recommendations = [];
      if (popularTV.length > 0) {
        try {
          // Get recommendations based on the first popular TV show
          const recRes = await getTVRecommendations(popularTV[0].id, 1, ac.signal);
          recommendations = (recRes?.results || []).slice(0, 10).map(tv => mapTmdbToCard(tv, "series"));
        } catch (error) {
          console.error("Error fetching TV recommendations:", error);
          // Fallback to popular TV shows if recommendations fail
          recommendations = popularTV.slice(0, 10);
        }
      }

      // rated (guest)
            const guestId = await get().ensureGuest();
            let rated = [];
            if (guestId) {
              try {
                const ratedRes = await getGuestRatedTV(guestId, 1, ac.signal);
                rated = (ratedRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));
              } catch (error) {
                console.warn("Failed to fetch guest rated TV shows:", error.message);
                // Clear invalid guest session
                localStorage.removeItem("tmdb.guest_session_id");
                set({ guestId: null });
              }
            }

      // trending, airing today
      const [trRes, airRes] = await Promise.all([
        getTrendingTV("day", 1, ac.signal),
        getTVAiringToday(1, ac.signal),
      ]);
      const popular = popularTV;
      const trending = (trRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));
      const airingToday = (airRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));

      // sematkan nama genre
      const addGenreName = (arr) => arr.map(it => {
        const firstId = Array.isArray(it.genre) ? it.genre[0] : it.genre;
        const name = genresTVMap[firstId] ?? it.genre;
        return { ...it, genre: name };
      });

      set({
        tvRecommended: addGenreName(recommendations),
        tvRated: addGenreName(rated),
        tvPopular: addGenreName(popular),
        tvTrending: addGenreName(trending),
        tvAiringToday: addGenreName(airingToday),
      });

      // Log if TMDB key is missing in production
      if (!import.meta.env.VITE_TMDB_KEY) {
        console.warn("VITE_TMDB_KEY is not set. API calls will fail.");
      }
    } catch (e) {
      set({ error: e?.message || "Gagal memuat data TV" });
    } finally {
      set({ loading: false });
      ac.abort(); // Abort after the operation is complete
    }
  },
}));
