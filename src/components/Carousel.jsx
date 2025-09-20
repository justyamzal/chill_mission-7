import { Splide, SplideSlide } from '@splidejs/react-splide';

export default function Carousel({
  title,        
  items,       
  perPage = 5,  
  history = false, 
}) {
 
  const options = history
    ? {
        type: "loop",
        perPage: 4,
        gap: "24px",
        pagination: false,
        arrows: true,
        drag: "free",
        snap: true,
        breakpoints: {
          1280: { perPage: 3.5, gap: "24px" },
          1024: { perPage: 2.5, gap: "16px" }, 
          480:  { perPage: 1.3, gap: "24px", arrows: false, drag: true },
          360:  { perPage: 1.1, gap: "24px", arrows: false, drag: true },
        },
      }
    : {
        type: "loop",
        perPage,
        gap: "10px",
        pagination: false,
        arrows: true,
        drag: "free",
        snap: true,
        breakpoints: {
          1280: { perPage, gap: "24px" },
          1024: { perPage: perPage - 1, gap: "24px" },
          480:  { perPage: 3.5, gap: "15px", arrows: false, drag: true },
          360:  { perPage: 3.3, gap: "15px", arrows: false, drag: true },
        },
      };

  return (
    <section className="w-full px-5 md:px-20 py-5 md:py-10">
      {title && (
        <h3 className="text-2xl md:text-[32px] font-bold pb-5 md:pb-8">
          {title}
        </h3>
      )}

      {/* adding className for CSS history splide arrow */}
      <Splide aria-label={title} options={options} className={history ? "history-carousel" : undefined}>
        {items.map((item, i) => (
          <SplideSlide key={i}>
            {history ? (
              
              <div
                className="relative w-full cursor-pointer overflow-hidden rounded-md"
                style={{ aspectRatio: "151 / 81" }} // ≈ 302/162
              >
                <img
                  src={item.src}
                  alt={item.title || ""}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 rounded-md p-4 flex items-center justify-between bg-gradient-to-t from-black to-transparent">
                  <div className="font-bold text-lg leading-tight">{item.title}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <img src="/icon/star.svg" alt="" className="w-4 h-4" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="reco-slide cursor-pointer">
                <img src={item.src} alt={item.title || ""} />
              </div>
            )}
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}
