// src/utils/tmdbService.js
import api from "./api";

// Gambar
export const imgUrl = (path, size = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/** Mapper universal → menyamakan movie & tv ke bentuk card */
export const mapTmdbToCard = (item, type) => {
  const title = item.title || item.name || "Untitled";
  const rating = Number.isFinite(item.vote_average)
    ? Math.round((item.vote_average / 2) * 10) / 10
    : undefined;

  return {
    id: item.id,
    type,                                  // "film" | "series"
    title,
    src: imgUrl(item.poster_path, "w342"), // poster
    genre: item.genre_ids?.[0] ?? undefined, // nanti bisa di-translate id→name
    age: item.certification ?? undefined,  // diisi saat ambil release_dates
    episodes: type === "series" ? (item.number_of_episodes ?? undefined) : undefined,
    rating,
    release_date: item.release_date || item.first_air_date,
  };
};

/* ===================== MOVIE ===================== */
// 1) Latest (single object)
export const getLatestMovie = async (signal) => (await api.get("/movie/latest", signal ? { signal } : undefined)).data;
// 2) Guest rated movies
export const getGuestRatedMovies = async (guestSessionId, page = 1, signal) =>
  (await api.get(`/guest_session/${guestSessionId}/rated/movies`, { params: { page, sort_by: "created_at.asc" }, signal: signal ? signal : undefined })).data;
// 3) Popular
export const getPopularMovies = async (page = 1, signal) =>
  (await api.get("/movie/popular", { params: { page }, signal: signal ? signal : undefined })).data;
// 4) Upcoming
export const getUpcomingMovies = async (page = 1, signal) =>
  (await api.get("/movie/upcoming", { params: { page }, signal: signal ? signal : undefined })).data;
// 4) Trending
export const getTrendingMovies = async (timeWindow = "day", page = 1, signal) =>
  (await api.get(`/trending/movie/${timeWindow}`, { params: { page }, signal: signal ? signal : undefined })).data;
// 5) Release dates per movie
export const getMovieReleaseDates = async (movieId, signal) =>
  (await api.get(`/movie/${movieId}/release_dates`, signal ? { signal } : undefined)).data;
// Ambil sertifikasi negara (US/ID)
export const pickCertification = (releaseDates, country = "US") => {
  const entry = releaseDates?.results?.find((r) => r.iso_3166_1 === country);
  return entry?.release_dates?.find((d) => d.certification)?.certification || undefined;
};
// Movie detail (opsional)
export const getMovieDetail = async (id, signal) =>
  (await api.get(`/movie/${id}`, signal ? { signal } : undefined)).data;
// 6) Recommendations
export const getMovieRecommendations = async (movieId, page = 1, signal) =>
  (await api.get(`/movie/${movieId}/recommendations`, { params: { page }, signal: signal ? signal : undefined })).data;

/* ===================== TV ===================== */
// 1) Latest (single object)
export const getLatestTV = async (signal) => (await api.get("/tv/latest", signal ? { signal } : undefined)).data;
// 2) Guest rated TV
export const getGuestRatedTV = async (guestSessionId, page = 1, signal) =>
  (await api.get(`/guest_session/${guestSessionId}/rated/tv`, { params: { page, sort_by: "created_at.asc" }, signal: signal ? signal : undefined })).data;
// 3) Popular
export const getPopularTV = async (page = 1, signal) =>
  (await api.get("/tv/popular", { params: { page }, signal: signal ? signal : undefined })).data;
// 4) Trending
export const getTrendingTV = async (timeWindow = "day", page = 1, signal) =>
  (await api.get(`/trending/tv/${timeWindow}`, { params: { page }, signal: signal ? signal : undefined })).data;
// 5) Airing today
export const getTVAiringToday = async (page = 1, signal) =>
  (await api.get("/tv/airing_today", { params: { page }, signal: signal ? signal : undefined })).data;
// TV detail (opsional)
export const getTVDetail = async (id, signal) =>
  (await api.get(`/tv/${id}`, signal ? { signal } : undefined)).data;
// 6) Recommendations
export const getTVRecommendations = async (tvId, page = 1, signal) =>
  (await api.get(`/tv/${tvId}/recommendations`, { params: { page }, signal: signal ? signal : undefined })).data;

/* ===================== Genre & Search ===================== */
export const getMovieGenres = async (signal) =>
  (await api.get("/genre/movie/list", signal ? { signal } : undefined)).data.genres; // [{id,name}]
export const getTVGenres = async (signal) =>
  (await api.get("/genre/tv/list", signal ? { signal } : undefined)).data.genres;

export const searchMulti = async (query, page = 1, signal) =>
  (await api.get("/search/multi", { params: { query, page }, signal: signal ? signal : undefined })).data;

/* ===================== Auth helper ===================== */
export const createGuestSession = async () => {
  const { data } = await api.get("/authentication/guest_session/new");
  if (data?.guest_session_id) {
    localStorage.setItem("tmdb.guest_session_id", data.guest_session_id);
  }
  return data;
};
