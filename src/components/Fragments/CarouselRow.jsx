// src/components/Fragments/CarouselRow.jsx
import { Splide, SplideSlide } from "@splidejs/react-splide";

const PRESET = {
  history: {
    fixedWidth: 302,
    fixedHeight: 162,
    perPage: 4,
    gap: "24px",
    breakpoints: {
      1366: { fixedWidth: 290, perPage: 4 },
      1280: { fixedWidth: 280, perPage: 3.5 },
      1024: { fixedWidth: 260, perPage: 2.5 },
      640:  { fixedWidth: 240, perPage: 1.7, arrows: false, gap: "16px" },
      400:  { fixedWidth: 220, perPage: 1.3, arrows: false, gap: "14px" },
    },
  },
  poster: {
    fixedWidth: 234,
    fixedHeight: 365,
    perPage: 5,
    gap: "24px",
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
  variant = "poster",   // "poster" | "history"
  options = {},
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
     <section className="w-full px-5 md:px-20 py-5 md:py-10">
      {title && <h3 className="text-2xl sm:text-[32px] font-bold pb-6">{title}</h3>}
      <Splide options={opts}>
        {items.map((it, i) => (
          <SplideSlide key={it.id ?? i}>
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img
                src={it.src}
                alt={it.title ?? `item ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {variant === "history" && (it.title || it.rating) && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm line-clamp-1">{it.title}</div>
                    {it.rating && (
                      <div className="flex items-center gap-1 text-xs">
                        <img src="/icon/star.svg" alt="rating" className="size-4" />
                        <span>{it.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}
