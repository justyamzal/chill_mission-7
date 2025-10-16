/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listShows, createShow, updateShow, deleteShow } from "../utils/showApi";

const Ctx = createContext(null);

export function ShowsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await listShows();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch shows:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Fungsi untuk menambahkan show baru
  const addShow = async (data) => {
    try {
      const sanitizedData = sanitize(data);
      const newShow = await createShow(sanitizedData);
      setItems(prev => [newShow, ...prev]);
      return newShow;
    } catch (error) {
      console.error("Failed to add show:", error);
      throw error;
    }
  };

  // Fungsi untuk memperbarui show
  const updateShowAPI = async (id, patch) => {
    try {
      const sanitizedPatch = sanitize(patch, true);
      const updatedShow = await updateShow(id, sanitizedPatch);
      setItems(prev => prev.map(item => item.id === id ? updatedShow : item));
      return updatedShow;
    } catch (error) {
      console.error("Failed to update show:", error);
      throw error;
    }
  };

  // Fungsi untuk menghapus show
  const removeShow = async (id) => {
    try {
      await deleteShow(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to remove show:", error);
      throw error;
    }
  };

  const api = useMemo(() => ({
    items,
    loading,
    addShow,
    updateShow: updateShowAPI,
    removeShow,
  }), [items, loading]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useShows() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShows must be used inside <ShowsProvider>");
  return ctx;
}

// normalisasi input
function sanitize(d, partial = false) {
  const out = {};
  const set = (k, v) => { if (!partial || d[k] !== undefined) out[k] = v; };

  set("id", d.id?.toString().trim());
  set("nama_tayangan", (d.nama_tayangan ?? "").toString().trim());
  set("tahun", d.tahun ? Number(d.tahun) : "");
  set("nominasi", d.nominasi || "history");        // history | top | trending | new
  set("genre", d.genre || "Aksi");
  set("kategori", d.kategori || "film");           // film | series
  set("foto_sampul", (d.foto_sampul ?? "").toString().trim());

 // rating: simpan angka 0..5 (boleh desimal)
  if (!partial || d.rating !== undefined) {
  const num = Number(d.rating);
  out.rating = Number.isFinite(num) ? Math.max(0, Math.min(5, num)) : "";
  }
  return out;
}
