import { Splide } from "@splidejs/react-splide";
import EnhancedSlide from "@/components/Elements/EnhancedSlide";

const PRESET = {
  history: {
    perPage: 4,
    gap: "24px",
    perMove: 1,
    breakpoints: {
      1280: { perPage: 4 },
      1024: { perPage: 3.5 },
      768:  { perPage: 3 },
      640:  { perPage: 2, arrows: false, gap: "16px" },
      400:  { perPage: 1.5, arrows: false, gap: "14px" },
    },
  },
  poster: {
    perPage: 5,
    gap: "24px",
    perMove: 1,
    breakpoints: {
      1280: { perPage: 5 },
      1024: { perPage: 4 },
      640:  { perPage: 3.5, arrows: false, gap: "15px" },
      400:  { perPage: 3.2, arrows: false, gap: "12px" },
    },
  },
};

export default function CarouselRow({
  title,
  items = [],
  variant = "poster",
  options = {},
  hoverMode = "hover",       // "hover" | "click"
  hoverOpenDelay = 300,      // tweak sensivitas
  hoverCloseDelay = 140,
}) {
  if (!items.length) return null;

  const preset = PRESET[variant] ?? PRESET.poster;
  const opts = {
    type: "loop",
    pagination: false,
    arrows: true,
    drag: "free",
    snap: true,
    ...preset,
    ...options,
  };

  return (
    <section
      className={`w-full px-5 md:px-20 py-5 md:py-10 ${
        variant === "history" ? "history-carousel" : "poster-carousel"
      }`}
    >
      {title && <h3 className="text-2xl sm:text-[32px] font-bold pb-6">{title}</h3>}
      {items.length === 0 ? (
        <p className="text-white/70">Tidak ada data yang tersedia</p>
      ) : (
        <Splide options={opts}>
          {items.map((it, i) => (
            <EnhancedSlide
              key={it.id ?? i}
              item={it}
              index={i}
              variant={variant}
              hoverMode={hoverMode}
              hoverOpenDelay={hoverOpenDelay}
              hoverCloseDelay={hoverCloseDelay}
            />
          ))}
        </Splide>
      )}
    </section>
  );
}
