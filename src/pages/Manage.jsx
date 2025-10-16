// src/pages/Manage.jsx
import { useMemo, useState } from "react";
import Navbar from "@/components/Fragments/Navbar";
import Footer from "@/components/Fragments/Footer";
import { useShows } from "@/state/shows-context";

import ManageToolbar from "@/components/Fragments/Manage/ManageToolbar";
import ManageForm from "@/components/Fragments/Manage/ManageForm";
import ManageList from "@/components/Fragments/Manage/ManageList";

export default function Manage() {
  const { items, loading, addShow, updateShow, removeShow } = useShows();

  // form
  const [editingId, setEditingId] = useState(null);
  const [imgMode, setImgMode] = useState("url");
  const [form, setForm] = useState({
    id: "", nama_tayangan: "", tahun: "",
    nominasi: "history", genre: "Aksi", kategori: "film",
    foto_sampul: "", rating: "",
  });

  // search & paging
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  // submit
  async function onSubmit(e) {
    e.preventDefault();
    if (!form.nama_tayangan) return; // Menghapus validasi foto_sampul karena akan diisi otomatis dari TMDB jika kosong

    const payload = {
      ...form,
      tahun: form.tahun ? String(parseInt(form.tahun, 10)) : "",
      rating: form.rating === "" ? "" : String(Math.max(0, Math.min(5, parseFloat(form.rating)))),
    };

    try {
      if (editingId) {
        await updateShow(editingId, payload);
        setEditingId(null);
      } else {
        await addShow(payload);
      }

      setForm({
        id: "", nama_tayangan: "", tahun: "",
        nominasi: "history", genre: "Aksi", kategori: "film",
        foto_sampul: "", rating: ""
      });
      setImgMode("url");
    } catch (error) {
      console.error("Failed to save show:", error);
      alert("Gagal menyimpan data tayangan: " + error.message);
    }
  }

  // derive (filter + sort + page)
  const {
    total, totalPages, safePage,
    start, end, pageItems, isMobile, mobileCount, mobileItems
  } = useMemo(() => {
    if (loading) {
      return {
        total: 0, totalPages: 0, safePage: 1,
        start: 0, end: 0, pageItems: [],
        isMobile: false, mobileCount: 0, mobileItems: []
      };
    }

    const q = query.trim().toLowerCase();

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
    }, [items, query, page, perPage, loading]);

    // list handlers
    const goto = (p) => setPage(Math.min(Math.max(1, p), totalPages));
    const onEditItem = (it) => {
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
    };
  const onDeleteItem = async (it) => {
    if (confirm(`Hapus "${it.nama_tayangan}"?`)) {
      try {
        await removeShow(it.id);
        if (editingId === it.id) {
          setEditingId(null);
          setForm({
            id: "", nama_tayangan: "", tahun: "",
            nominasi: "history", genre: "Aksi", kategori: "film",
            foto_sampul: "", rating: ""
          });
          setImgMode("url");
        }
      } catch (error) {
        console.error("Failed to delete show:", error);
        alert("Gagal menghapus data tayangan: " + error.message);
      }
    }
  };
  const onChangeNom = async (it, nom) => {
    try {
      await updateShow(it.id, { nominasi: nom });
    } catch (error) {
      console.error("Failed to update nomination:", error);
      alert("Gagal memperbarui nominasi: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#181A1C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat data tayangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <main className="px-5 md:px-20 py-6 md:py-10 space-y-10">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold">Manage Tayangan</h1>
          <p className="mt-3 mb-3 text-sm">
            <span className="rounded-full bg-white/10 px-2 py-1">
              Mode: {editingId ? "Edit data" : "Tambah data"}
            </span>
          </p>
          <p className="text-white/70 mt-1">Tambah/ubah/hapus data tayangan. Data disimpan di mockAPI.</p>

          <ManageToolbar
            query={query}
            perPage={perPage}
            onQuery={(v) => { setQuery(v); setPage(1); }}
            onPerPage={(n) => { setPerPage(n); setPage(1); }}
          />
        </header>

        <ManageForm
          form={form}
          setForm={setForm}
          imgMode={imgMode}
          setImgMode={setImgMode}
          editingId={editingId}
          onSubmit={onSubmit}
        />

        <section className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Data Tersimpan</h2>

          <ManageList
            pageItems={pageItems}
            isMobile={isMobile}
            mobileItems={mobileItems}
            mobileCount={mobileCount}
            total={total}
            start={start}
            end={end}
            page={safePage}
            totalPages={totalPages}
            onPrev={() => goto(safePage - 1)}
            onNext={() => goto(safePage + 1)}
            onMore={() => setPage((p) => p + 1)}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
            onChangeNom={onChangeNom}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
