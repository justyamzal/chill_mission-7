// src/utils/showApi.js
import { fetchPosterUrl } from './tmdbService';

const BASE = import.meta.env.VITE_MOCKAPI_BASE;
export const SHOWS = `${BASE}/shows`;

export async function listShows(params={}) {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(qs ? `${SHOWS}?${qs}` : SHOWS);
  if (!r.ok) throw new Error('Fetch shows failed');
  return r.json();
}

export async function getShow(id) {
  const r = await fetch(`${SHOWS}/${id}`);
  if (!r.ok) throw new Error('Fetch show failed');
  return r.json();
}

export async function createShow(showData) {
  // Jika tidak ada foto_sampul, coba ambil dari TMDB
  let finalData = { ...showData };
  if (!showData.foto_sampul || showData.foto_sampul.trim() === '') {
    try {
      const posterUrl = await fetchPosterUrl(showData.nama_tayangan, showData.kategori);
      if (posterUrl) {
        finalData = { ...finalData, foto_sampul: posterUrl };
      }
    } catch (error) {
      console.warn('Failed to fetch poster from TMDB:', error);
    }
  }
  
  const r = await fetch(SHOWS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finalData),
  });
  
  if (!r.ok) throw new Error('Create show failed');
  return r.json();
}

export async function updateShow(id, showData) {
  // Jika tidak ada foto_sampul, coba ambil dari TMDB
  let finalData = { ...showData };
  if (!showData.foto_sampul || showData.foto_sampul.trim() === '') {
    try {
      const posterUrl = await fetchPosterUrl(showData.nama_tayangan, showData.kategori);
      if (posterUrl) {
        finalData = { ...finalData, foto_sampul: posterUrl };
      }
    } catch (error) {
      console.warn('Failed to fetch poster from TMDB:', error);
    }
  }
  
  const r = await fetch(`${SHOWS}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finalData),
  });
  
  if (!r.ok) throw new Error('Update show failed');
  return r.json();
}

export async function deleteShow(id) {
  const r = await fetch(`${SHOWS}/${id}`, {
    method: 'DELETE',
  });
  
  if (!r.ok) throw new Error('Delete show failed');
  return r.json();
}
