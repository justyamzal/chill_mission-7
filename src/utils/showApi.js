// src/utils/showApi.js
import { fetchPosterUrl } from './tmdbService';

const BASE = import.meta.env.VITE_MOCKAPI_BASE;
// Asumsikan BASE adalah root URL dan kita perlu tambahkan /shows
export const SHOWS = `${BASE}/shows`;

export async function listShows(params={}) {
  const qs = new URLSearchParams(params).toString();
  console.log("Fetching from URL:", qs ? `${SHOWS}?${qs}` : SHOWS);
  const r = await fetch(qs ? `${SHOWS}?${qs}` : SHOWS);
  console.log("Response status:", r.status);
  if (!r.ok) {
    console.error("Fetch shows failed with status:", r.status);
    throw new Error('Fetch shows failed');
  }
  const response = await r.json();
  console.log("Raw response from API:", response);
  
  // Coba berbagai kemungkinan struktur data
  let data;
  if (Array.isArray(response)) {
    data = response;
  } else if (response && typeof response === 'object') {
    // Coba cari array dalam response
    if (response.data && Array.isArray(response.data)) {
      data = response.data;
    } else if (response.results && Array.isArray(response.results)) {
      data = response.results;
    } else if (response.shows && Array.isArray(response.shows)) {
      data = response.shows;
    } else if (response.Items && Array.isArray(response.Items)) {
      data = response.Items;
    } else if (response.records && Array.isArray(response.records)) {
      data = response.records;
    } else if (response.rows && Array.isArray(response.rows)) {
      data = response.rows;
    } else {
      // Jika hanya satu objek, buat menjadi array
      data = [response];
    }
  } else {
    console.warn("API returned unexpected data type, creating empty array");
    data = [];
  }
  
  console.log("Processed data from API:", data);
  return data;
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
