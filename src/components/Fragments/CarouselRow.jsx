// src/components/Fragments/CarouselRow.jsx
import { Splide, SplideSlide } from "@splidejs/react-splide";

 const PRESET = {
   // 4 card tetap di desktop
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
   // default 5 card di desktop
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
    <section
      className={`w-full px-5 md:px-20 py-5 md:py-10 ${variant === "history" ? "history-carousel" : "poster-carousel"}`}>

      {title && <h3 className="text-2xl sm:text-[32px] font-bold pb-6">{title}</h3>}
      <Splide options={opts}>
        {items.map((it, i) => (
          <SplideSlide key={it.id ?? i}>
            {/* kunci tinggi kartu supaya konsisten */}
            <div className={`relative w-full overflow-hidden rounded-lg ${
              variant === "history" ? "h-[162px]" : "h-[365px]"
            }`}>
              <img
                src={it.src}
                alt={it.title ?? `item ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
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
