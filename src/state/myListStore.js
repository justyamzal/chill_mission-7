/* simpan data lokal hasil input user (localStorage)*/ 

// src/state/myListStore.js
import { create } from "zustand";
const LS_KEY = "chill.mylist.v1";

const readLS = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; }
  catch { return []; }
};
const writeLS = (v) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(v)); }
  catch (e) { console.warn("localStorage write failed:", e); }
};

// normalisasi input (porting dari sanitize)
const normalize = (d, partial = false) => {
  const out = {};
  const set = (k, v) => { if (!partial || d[k] !== undefined) out[k] = v; };

  set("id", d.id?.toString().trim());
  set("nama_tayangan", (d.nama_tayangan ?? "").toString().trim());
  set("tahun", d.tahun ? Number(d.tahun) : "");
  set("nominasi", d.nominasi || "history");
  set("genre", d.genre || "Aksi");
  set("kategori", d.kategori || "film");
  set("foto_sampul", (d.foto_sampul ?? "").toString().trim());

  if (!partial || d.rating !== undefined) {
    const num = Number(d.rating);
    out.rating = Number.isFinite(num) ? Math.max(0, Math.min(5, num)) : "";
  }
  return out;
};

export const useMyListStore = create((set, get) => ({
  items: readLS(),

  addItem: (data) => {
    const now = Date.now();
    const id = crypto?.randomUUID?.() ?? String(now);
    const item = { ...normalize(data), id, createdAt: now, updatedAt: now };
    const updated = [item, ...get().items];
    writeLS(updated);
    set({ items: updated });
  },

  updateItem: (id, patch) => {
    const updated = get().items.map(it =>
      it.id === id ? { ...it, ...normalize(patch, true), updatedAt: Date.now() } : it
    );
    writeLS(updated);
    set({ items: updated });
  },

  removeItem: (id) => {
    const updated = get().items.filter(it => it.id !== id);
    writeLS(updated);
    set({ items: updated });
  },
}));
