// src/utils/api.js

import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_KEY,
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