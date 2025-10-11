import { useEffect, useRef, useState } from "react";
import Button from "../Elements/Button";
import Badge from "../Elements/Badge";

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
      <div
        ref={dropRef}
        className="absolute z-30"
        style={{ top: "60px", left: "80px" }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center justify-between w-[128px] px-5 py-2
                     rounded-2xl bg-[#181A1C]/70 border border-white/20
                     text-white font-medium hover:bg-[#3D4142]/70 transition"
        >
          Genre
          <svg xmlns="http://www.w3.org/2000/svg"
               className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
               viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {open && (
          <div
            className="absolute mt-3 p-4 z-40
                       bg-[#181A1C]/95 backdrop-blur-md text-white
                       border border-white/20 rounded-2xl
                       shadow-[0_10px_40px_rgba(0,0,0,0.35)]
                       grid grid-cols-2 gap-x-6 gap-y-2"
            style={{ width: "392px", height: "252px" }}
          >
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => pick(g)}
                className="text-left text-sm hover:text-[#9DA0A1] transition-colors"
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

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
