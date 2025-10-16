// src/utils/tmdb.js
const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;
const TMDB_V3 = import.meta.env.VITE_TMDB_API_KEY;

async function tmdbSearch(title, type) {
  const url = new URL(`https://api.themoviedb.org/3/search/${type}`);
  url.searchParams.set('query', title);
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('language', 'en-US');

  const opts = TMDB_BEARER
    ? { headers: { Authorization: `Bearer ${TMDB_BEARER}` } }
    : undefined;

  if (!TMDB_BEARER && TMDB_V3) url.searchParams.set('api_key', TMDB_V3);

  const res = await fetch(url, opts);
  const data = await res.json();
  return data.results?.[0] ?? null;
}

export async function fetchPosterUrl(title, type) {
  // type: 'film' -> 'movie', 'series' -> 'tv'
  const t = type === 'series' ? 'tv' : 'movie';

  // cache sederhana
  const key = `poster:${t}:${title}`;
  const cached = localStorage.getItem(key);
  if (cached) return cached;

  const hit = await tmdbSearch(title, t);
  const url = hit?.poster_path ? `https://image.tmdb.org/t/p/w500${hit.poster_path}` : '';
  if (url) localStorage.setItem(key, url);
  return url;
}
