// src/utils/tmdbService.js
import api from "./api";

// helper untuk gambar
export const imgUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

// --- Movies ---
export const getPopularMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/popular", { params: { page }, signal });
  return data; // {page, results, total_pages, ...}
};

export const getTopRatedMovies = async (page = 1, signal) => {
  const { data } = await api.get("/movie/top_rated", { params: { page }, signal });
  return data;
};

export const getMovieDetail = async (id, signal) => {
  const { data } = await api.get(`/movie/${id}`, { signal });
  return data;
};

// --- TV ---
export const getPopularTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/popular", { params: { page }, signal });
  return data;
};

export const getTopRatedTV = async (page = 1, signal) => {
  const { data } = await api.get("/tv/top_rated", { params: { page }, signal });
  return data;
};

export const getTVDetail = async (id, signal) => {
  const { data } = await api.get(`/tv/${id}`, { signal });
  return data;
};

// --- Genre & Search ---
export const getMovieGenres = async (signal) => {
  const { data } = await api.get("/genre/movie/list", { signal });
  return data.genres; // [{id, name}]
};

export const searchMulti = async (query, page = 1, signal) => {
  const { data } = await api.get("/search/multi", { params: { query, page }, signal });
  return data;
};
