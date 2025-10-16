/* opsional: menyimpan patch/edit dari TMDB item */ 

// src/state/overridesStore.js
import { create } from "zustand";
const LS_KEY = "chill.overrides.v1";

const readLS = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? {}; } catch { return {}; } };
const writeLS = (v) => { try { localStorage.setItem(LS_KEY, JSON.stringify(v)); } catch (e) { console.warn("LS write failed", e); } };

// key: `${type}:${tmdbId}` → value: patch object
export const useOverridesStore = create((set, get) => ({
  map: readLS(),  // { "film:123": { title:"...", age:"..." }, ... }

  setPatch: (type, tmdbId, patch) => {
    const k = `${type}:${tmdbId}`;
    const next = { ...get().map, [k]: { ...(get().map[k] || {}), ...patch, updatedAt: Date.now() } };
    writeLS(next);
    set({ map: next });
  },

  getPatched: (card) => {
    const k = `${card.type}:${card.id}`;
    return { ...card, ...(get().map[k] || {}) };
  },
}));
