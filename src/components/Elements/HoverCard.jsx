// src/components/Elements/HoverCard.jsx
import { useRef, useState, useCallback } from "react";

export default function HoverCard({
  imageSrc,
  title = "Judul Tayangan",
  genre = "Genre",
  ageText = "TBD",
  episodesText = "TBD",
}) {
  const cardRef = useRef(null);
  const [align, setAlign] = useState("left"); // 'left' | 'right'

  const handleEnter = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    // sementara posisikan ke kiri dulu untuk hitung
    el.style.left = "0px";
    el.style.right = "auto";
    const r = el.getBoundingClientRect();
    const pad = 16; // margin aman viewport

    if (r.right > window.innerWidth - pad) {
      setAlign("right"); // flip ke kanan bila mentok kanan
    } else if (r.left < pad) {
      setAlign("left"); // paksa kiri bila mentok kiri
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      className={[
        // tampil saat hover
        "invisible opacity-0 scale-95 group-hover:visible group-hover:opacity-100 group-hover:scale-100",
        "transition-all duration-200 ease-out",
        "pointer-events-none group-hover:pointer-events-auto",
        // posisi dasar
        "absolute z-50 top-[-14px] md:top-[-18px] xl:top-[-24px]",
        align === "right" ? "right-0 left-auto" : "left-0",
        // ukuran: lebih proporsional di md, full spek di xl
        "w-[332px] h-[380px] md:w-[360px] md:h-[420px] xl:w-[408px] xl:h-[460px]",
        "rounded-2xl overflow-hidden bg-[#252729] border border-white/10",
        "shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        // cegah nabrak viewport secara horizontal
        "max-w-[calc(100vw-2rem)]",
      ].join(" ")}
      style={{ transformOrigin: "top left" }}
    >
      {/* Gambar */}
      <div className="relative w-full h-[190px] md:h-[220px] xl:h-[264px]">
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Konten */}
      <div className="p-4 md:p-5 flex flex-col gap-3.5 md:gap-4">
        {/* Tombol */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 md:gap-3">
            <button
              className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] xl:w-[55px] xl:h-[55px] rounded-full bg-white text-black flex items-center justify-center"
              aria-label="Play"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button
              className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] xl:w-[55px] xl:h-[55px] rounded-full border border-white/20 bg-[#3D4142] text-white flex items-center justify-center"
              aria-label="Tandai Selesai"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            </button>
          </div>

          <button
            className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] xl:w-[55px] xl:h-[55px] rounded-full border border-white/20 bg-[#3D4142] text-white flex items-center justify-center"
            aria-label="Detail"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 text-[12px] md:text-[13px] text-white/90">
          <span className="px-2.5 py-1 rounded-full bg-white/10">{ageText}</span>
          <span className="text-white/60">•</span>
          <span className="px-2.5 py-1 rounded-full bg-white/10">{episodesText} Episode</span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1">
          <h4 className="text-base md:text-lg font-semibold line-clamp-1">{title}</h4>
          <div className="flex items-center gap-2 text-sm text-white/85">
            <span className="px-3 py-1 rounded-full bg-[#33373A]">{genre}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
