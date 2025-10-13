// src/pages/Manage.jsx
import { useMemo, useState } from "react";
import Navbar from "@/components/Fragments/Navbar";
import Footer from "@/components/Fragments/Footer";
import { useShows } from "@/state/shows-context";

// ====== Util kecil ======
const GENRES = [
  "Aksi", "Anak-anak", "Anime", "Britania", "Drama",
  "Fantasi ilmiah & fantasi", "Kejahatan", "KDrama",
  "Komedi", "Petualangan", "Perang", "Romantis", "Sains & Alam", "Thriller",
];
const labelNominasi = (v) =>
  ({ history: "History (Melanjutkan)", top: "Top", trending: "Trending", new: "Rilis Baru", original: "Persembahan Chill" }[v] ?? v ?? "-");

function compressImage(file, targetW, targetH, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const revoke = (url) => URL.revokeObjectURL(url);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW; canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      const r = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const w = img.naturalWidth * r;
      const h = img.naturalHeight * r;
      const x = (targetW - w) / 2;
      const y = (targetH - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      resolve(canvas.toDataURL("image/webp", quality));
    };
    img.onerror = reject;
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onloadend = () => revoke(objectUrl);
  });
}

// ====== Komponen kecil ======
function Input({ label, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-white/80">{label}</span>}
      <input
        {...props}
        className="rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40"
      />
    </label>
  );
}
function Select({ label, options, className = "", ...props }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      {label && <span className="text-sm text-white/80">{label}</span>}
      <select
        {...props}
        className="rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40"
      >
        {options.map(([val, text]) => (
          <option key={val} value={val}>{text}</option>
        ))}
      </select>
    </label>
  );
}

// ====== Halaman Manage ======
export default function Manage() {
  const { items, addShow, updateShow, removeShow } = useShows();

  // form
  const [editingId, setEditingId] = useState(null);
  const [imgMode, setImgMode] = useState("url"); // "url" | "upload"
  const [form, setForm] = useState({
    id: "", nama_tayangan: "", tahun: "",
    nominasi: "history", genre: "Aksi", kategori: "film",
    foto_sampul: "", rating: "",
  });

  // search & paging
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  // handlers form
  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => {
      if (name === "rating") {
        const num = Math.max(0, Math.min(5, parseFloat(value || "")));
        return { ...s, rating: Number.isNaN(num) ? "" : String(num) };
      }
      return { ...s, [name]: value };
    });
  }
  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPoster = form.nominasi !== "history";
    const target = isPoster ? { w: 234, h: 365 } : { w: 302, h: 162 };
    try {
      const dataUrl = await compressImage(file, target.w, target.h, 0.82);
      setForm(s => ({ ...s, foto_sampul: dataUrl }));
    } catch {
      alert("Gagal memproses gambar.");
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    if (!form.nama_tayangan || !form.foto_sampul) return;

    const payload = {
      ...form,
      id: form.id?.trim() ? form.id : (crypto?.randomUUID?.() ?? String(Date.now())),
      tahun: form.tahun ? String(parseInt(form.tahun, 10)) : "",
      rating: form.rating === "" ? "" : String(Math.max(0, Math.min(5, parseFloat(form.rating)))),
    };

    if (editingId) {
      // FIX: buang id tanpa langgar no-unused-vars
      const { id: _ID_UNUSED, ...patch } = payload;
      updateShow(editingId, patch);
      setEditingId(null);
    } else {
      addShow(payload);
    }

    setForm({
      id: "", nama_tayangan: "", tahun: "",
      nominasi: "history", genre: "Aksi", kategori: "film",
      foto_sampul: "", rating: ""
    });
    setImgMode("url");
  }

  // derive list (filter + sort + page)
  const {
    sorted, total, totalPages, safePage,
    start, end, pageItems, isMobile, mobileCount, mobileItems
  } = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Filter items based on search query
    const filtered = items.filter((it) => {
      const name = (it.nama_tayangan ?? "").toLowerCase();
      const genre = (it.genre ?? "").toLowerCase();
      const kategori = (it.kategori ?? "").toLowerCase();
      const tahun = (it.tahun ?? "").toString();
      return (
        !q ||
        name.includes(q) ||
        genre.includes(q) ||
        kategori.includes(q) ||
        tahun.includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, total);
    const pageItems = sorted.slice(startIdx, endIdx);

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    const mobileCount = Math.min(sorted.length, safePage * perPage);
    const mobileItems = sorted.slice(0, mobileCount);

    return {
      sorted, total, totalPages, safePage,
      start: startIdx + 1, end: endIdx, pageItems,
      isMobile, mobileCount, mobileItems
    };
  }, [items, query, page, perPage]);

  const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <main className="px-5 md:px-20 py-6 md:py-10 space-y-10">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold">Manage Tayangan</h1>
          <p className="mt-3 mb-3 text-sm">
            <span className="rounded-full bg-white/10 px-2 py-1">
              Mode: {editingId ? "Edit data" : "Tambah data"}
            </span>
          </p>
          <p className="text-white/70 mt-1">Tambah/ubah/hapus data tayangan. Data disimpan di localStorage.</p>

          {/* Toolbar: cari + page size */}
          <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Cari judul / genre / kategori / tahun…"
              className="w-full md:max-w-md rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-white/70">Tampilkan</label>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }}
                className="rounded-xl border border-white/20 bg-[#242628] px-3 py-2 text-sm outline-none focus:border-white/40"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </header>

        {/* FORM */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input label="ID (opsional, auto jika kosong)" name="id" value={form.id} onChange={onChange} placeholder="auto" />
            <Input label="Nama tayangan" name="nama_tayangan" value={form.nama_tayangan} onChange={onChange} required />
            <Input label="Tahun terbit" name="tahun" type="number" value={form.tahun} onChange={onChange} placeholder="2024" />

            <Select label="Nominasi (kolom carousel)" name="nominasi" value={form.nominasi} onChange={onChange}
              options={[
                ["history","History (Melanjutkan)"],
                ["top","Top Rating Film & Series Hari ini"],
                ["original","Persembahan Chill"],
                ["trending","Trending"],
                ["new","Rilis Baru"],
              ]} />

            <Input label="Rating (0–5)" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={onChange} placeholder="mis. 4.5" />

            <Select label="Genre" name="genre" value={form.genre} onChange={onChange}
              options={GENRES.map(g => [g, g])} />

            <Select label="Kategori" name="kategori" value={form.kategori} onChange={onChange}
              options={[["film","Film"],["series","Series"]]} />

            {/* Foto sampul */}
            <div className="md:col-span-2 lg:col-span-3 grid gap-3">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="imgMode" checked={imgMode === "url"} onChange={() => setImgMode("url")} />
                  <span className="text-sm">Gunakan URL</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="imgMode" checked={imgMode === "upload"} onChange={() => setImgMode("upload")} />
                  <span className="text-sm">Upload & kompres</span>
                </label>
              </div>

              {imgMode === "url" ? (
                <Input label="URL foto sampul" name="foto_sampul" value={form.foto_sampul} onChange={onChange} placeholder="/content-img/top_1.webp" />
              ) : (
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Upload foto sampul</span>
                  <input type="file" accept="image/*" onChange={onPickFile}
                    className="rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none focus:border-white/40" />
                  <p className="text-xs text-white/60">Gambar akan dikompresi otomatis agar proporsional.</p>
                </label>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-3 pt-2">
              <button type="submit" className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2">
                {editingId ? "Simpan Perubahan" : "Tambah"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      id: "", nama_tayangan: "", tahun: "",
                      nominasi: "history", genre: "Aksi", kategori: "film",
                      foto_sampul: "", rating: ""
                    });
                    setImgMode("url");
                  }}
                  className="ml-2 rounded-xl bg-red-600/80 hover:bg-red-600 px-5 py-2"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Data Tersimpan</h2>

          {total === 0 ? (
            <p className="text-white/70">Belum ada data.</p>
          ) : (
            <>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(isMobile ? mobileItems : pageItems).map((it) => (
                  <li key={it.id} className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                    <img src={it.foto_sampul} alt={it.nama_tayangan} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold line-clamp-1">{it.nama_tayangan}</p>
                        <span className="text-xs rounded-full bg-white/10 px-2 py-1">{it.kategori}</span>
                      </div>
                      <p className="text-sm text-white/70">{it.genre} • {it.tahun || "-"}</p>
                      <p className="text-xs text-white/60">Nominasi: {labelNominasi(it.nominasi)}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingId(it.id);
                            setForm({
                              id: it.id,
                              nama_tayangan: it.nama_tayangan,
                              tahun: it.tahun || "",
                              nominasi: it.nominasi,
                              genre: it.genre,
                              kategori: it.kategori,
                              foto_sampul: it.foto_sampul,
                              rating: (it.rating ?? "").toString(),
                            });
                            setImgMode(it.foto_sampul?.startsWith("data:") ? "upload" : "url");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus "${it.nama_tayangan}"?`)) {
                              removeShow(it.id);
                              if (editingId === it.id) {
                                setEditingId(null);
                                setForm({
                                  id: "", nama_tayangan: "", tahun: "",
                                  nominasi: "history", genre: "Aksi", kategori: "film",
                                  foto_sampul: "", rating: ""
                                });
                                setImgMode("url");
                              }
                            }
                          }}
                          className="rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-1 text-sm"
                        >
                          Hapus
                        </button>

                        <select
                          className="rounded-lg bg-transparent border border-white/20 px-2 py-1 text-sm"
                          value={it.nominasi}
                          onChange={(e) => updateShow(it.id, { nominasi: e.target.value })}
                        >
                          <option value="history">History</option>
                          <option value="top">Top</option>
                          <option value="trending">Trending</option>
                          <option value="new">Rilis Baru</option>
                          <option value="original">Persembahan Chill</option>
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Kontrol navigasi */}
              {isMobile ? (
                mobileCount < sorted.length ? (
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-2 text-sm"
                    >
                      Muat lebih banyak ({mobileCount}/{sorted.length})
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-sm text-white/60 mt-5">
                    Semua data sudah tampil ({sorted.length})
                  </p>
                )
              ) : (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-white/70">
                    Menampilkan {start}–{end} dari {total} data
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goto(safePage - 1)}
                      disabled={safePage <= 1}
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-sm">Hal {safePage} / {totalPages}</span>
                    <button
                      onClick={() => goto(safePage + 1)}
                      disabled={safePage >= totalPages}
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
