/* fetch & simpan data dari TMDB (API) */
// src/state/showStore.js
import { create } from "zustand";
import {
  // Movies
  getLatestMovie, getGuestRatedMovies, getPopularMovies, getTrendingMovies,
  getMovieReleaseDates, pickCertification,
  // TV
  getLatestTV, getGuestRatedTV, getPopularTV, getTrendingTV, getTVAiringToday,
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
  movieLatest: [],      // array of 1
  movieRated: [],
  moviePopular: [],
  movieTrending: [],
  movieReleaseCerts: [],

  // ==== TV rows ====
  tvLatest: [],         // array of 1
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
      // latest
      let latest = [];
      try {
        const latestObj = await getLatestMovie(ac.signal);
        console.log("Raw latest movie data:", latestObj);
        if (latestObj && latestObj.id) {
          latest = [mapTmdbToCard(latestObj, "film")];
          console.log("Mapped latest movie data:", latest);
        } else {
          console.warn("Latest movie data is missing ID or is null:", latestObj);
        }
      } catch (error) {
        console.error("Error fetching latest movie:", error);
        set({ error: error?.message || "Gagal memuat data movie terbaru" });
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

      // popular & trending
      const [popRes, trRes] = await Promise.all([
        getPopularMovies(1, ac.signal),
        getTrendingMovies("day", 1, ac.signal),
      ]);
      const popular = (popRes?.results || []).map(m => mapTmdbToCard(m, "film"));
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

      set({
        movieLatest: addGenreName(latest),
        movieRated: addGenreName(rated),
        moviePopular: addGenreName(popular),
        movieTrending: addGenreName(trending),
        movieReleaseCerts: addGenreName(certRows),
      });
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
      // latest
      let latest = [];
      try {
        const latestObj = await getLatestTV(ac.signal);
        console.log("Raw latest TV data:", latestObj);
        if (latestObj && latestObj.id) {
          latest = [mapTmdbToCard(latestObj, "series")];
          console.log("Mapped latest TV data:", latest);
        } else {
          console.warn("Latest TV data is missing ID or is null:", latestObj);
        }
      } catch (error) {
        console.error("Error fetching latest TV:", error);
        set({ error: error?.message || "Gagal memuat data TV terbaru" });
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

      // popular, trending, airing today
      const [popRes, trRes, airRes] = await Promise.all([
        getPopularTV(1, ac.signal),
        getTrendingTV("day", 1, ac.signal),
        getTVAiringToday(1, ac.signal),
      ]);
      const popular = (popRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));
      const trending = (trRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));
      const airingToday = (airRes?.results || []).map(tv => mapTmdbToCard(tv, "series"));

      // sematkan nama genre
      const addGenreName = (arr) => arr.map(it => {
        const firstId = Array.isArray(it.genre) ? it.genre[0] : it.genre;
        const name = genresTVMap[firstId] ?? it.genre;
        return { ...it, genre: name };
      });

      set({
        tvLatest: addGenreName(latest),
        tvRated: addGenreName(rated),
        tvPopular: addGenreName(popular),
        tvTrending: addGenreName(trending),
        tvAiringToday: addGenreName(airingToday),
      });
    } catch (e) {
      set({ error: e?.message || "Gagal memuat data TV" });
    } finally {
      set({ loading: false });
      ac.abort(); // Abort after the operation is complete
    }
  },
}));
