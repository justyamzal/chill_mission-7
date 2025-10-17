// src/utils/api.js

import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

// Check if API key is available
if (!import.meta.env.VITE_TMDB_KEY) {
  console.error("TMDB API key is missing! Please set VITE_TMDB_KEY environment variable.");
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY || "", // Provide empty string as fallback to prevent undefined
    language: "id-ID", // ganti ke "en-US" kalau mau
  },
  timeout: 15000,
});

// Interceptor opsional: log error singkat
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[TMDB API ERROR]", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export default api;