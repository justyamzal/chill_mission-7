// src/components/Fragments/SeriesHero.jsx
import { useEffect, useRef, useState } from "react";
import Button from "../Elements/Button";
import Badge from "../Elements/Badge";
import GenreDropdown from "../Elements/GenreDropdown";

export default function SeriesHero({ genres = [], onGenreChange }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (g) => { onGenreChange?.(g); setOpen(false); };

  return (
    <section className="relative w-full h-[64vh] sm:h-[70vh] max-h-[587px] bg-no-repeat bg-cover overflow-hidden" style={{
        backgroundImage: "url('/bg-img/bg-hero-series.webp')",
        backgroundPosition: "center 0%",  
        backgroundSize: "cover",          
      }} >

      {/* <div className="hero-overlay" />
      <div className="hero-feather" /> */}

      {/*----- Button Genre (overlay) ----- */}
      <GenreDropdown genres={genres} onPick={onGenreChange} className="hidden md:block" />

      {/* Konten kiri – ukuran & spacing samakan dengan Home */}
      <div className="relative z-10 px-5 md:px-20 lg:px-24 pt-20 sm:pt-72">
        <h1 className="text-2xl sm:text-5xl font-extrabold leading-tight text-shadow">Happiness</h1>
        <p className="mt-3 max-w-[668px] text-sm sm:text-base text-white/90">
          Mengisahkan tentang kelompok orang yang berjuang untuk bertahan hidup di
          dalam sebuah gedung apartemen yang penuh dengan zombie. Sayangnya, virus
          zombie hanya terdapat di dalam area apartemen tersebut dan tidak menyebar
          ke luar kawasan apartemen.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="primary">Mulai</Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <img src="/icon/info.svg" alt="info" className="size-5" />
            <span>Selengkapnya</span>
          </Button>
          <Badge>18+</Badge>
        </div>
      </div>
    </section>
  );
}
