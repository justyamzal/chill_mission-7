import { useEffect, useRef, useState } from "react";
import Button from "../Elements/Button";
import Badge from "../Elements/Badge";
import GenreDropdown from "../Elements/GenreDropdown";

export default function FilmHero({ genres = [], onGenreChange }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (g) => { onGenreChange?.(g); setOpen(false); };

  return (
    <section
      className="
        relative w-full overflow-hidden
        h-[64vh] sm:h-[70vh] max-h-[587px]
        bg-no-repeat bg-cover
      "
      style={{
        backgroundImage: "url('/bg-img/bg-hero-film.webp')",
        backgroundPosition: "60% center",  // geser kalau perlu: 55–65%
        backgroundSize: "110% auto",       // sedikit zoom agar framing mirip desain
      }}
    >
      {/* overlay & feather sama persis dengan Home/Series */}
      <div className="hero-overlay" />
      <div className="hero-feather" />

      {/* Tombol Genre (overlay, tidak menggeser layout) */}
      <GenreDropdown genres={genres} onPick={onGenreChange} />

      {/* Konten kiri – samakan ukuran & spacing dengan Home/Series */}
      <div className="relative z-10 px-5 md:px-20 lg:px-24 pt-20 sm:pt-72">
        <h1 className="text-2xl sm:text-5xl font-extrabold leading-tight text-shadow">
          Avatar 3
        </h1>
        <p className="mt-3 max-w-[668px] text-sm sm:text-base text-white/90">
          "Avatar 3" melanjutkan cerita konflik antara manusia dan Na'vi di planet Pandora. 
          Pertempuran untuk melindungi tanah mereka semakin memuncak…
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
