import { useState, useEffect } from "react";
import { SplideSlide } from "@splidejs/react-splide";
import HoverCard from "./HoverCard";
import { fetchPosterUrl } from "@/utils/tmdbService";

/** Ambil SATU genre pertama dari berbagai bentuk data. */
function getFirstGenre(it) {
  // kumpulkan kandidat dari berbagai path umum (top-level & nested)
  const candidates = [
    it?.genre, it?.genres, it?.kategori, it?.category, it?.tags, it?.labels,
    it?.meta?.genre, it?.meta?.genres,
    it?.metadata?.genre, it?.metadata?.genres,
    it?.details?.genre, it?.details?.genres,
    it?.data?.genre, it?.data?.genres,
  ].filter(Boolean);

  // ubah ke array string "flat"
  const flat = [];
  const pushVal = (v) => {
    if (!v) return;
    if (typeof v === "string") { flat.push(v); return; }
    if (typeof v === "number") { flat.push(String(v)); return; }
    if (Array.isArray(v)) { v.forEach(pushVal); return; }
    if (typeof v === "object") {
      // object {name:"Drama"} | {label:"Drama"} | {title:"Drama"}
      pushVal(v.name ?? v.label ?? v.title ?? v.text ?? null);
    }
  };
  candidates.forEach(pushVal);

  // pecah delimiter umum: koma, titik koma, slash, pipe, bullet, dash
  const tokens = [];
  flat.forEach(s => {
    String(s)
      .split(/[,;/|•-]+/g)
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(t => tokens.push(t));
  });

  // hasil: genre pertama (string) atau undefined kalau memang tidak ada
  return tokens[0];
}

/** Normalisasi age dari berbagai field. */
function getAge(it) {
  const raw = it.age ?? it.rating_age ?? it.pg ?? it.pg_rating ?? it.maturity ?? it.classification;
  if (raw == null) return undefined;
  const s = String(raw).trim();
  return /^\d+$/.test(s) ? `${s}+` : s;
}

/** Ambil episodes (angka/string). */
function getEpisodes(it) {
  const raw = it.episodes ?? it.totalEpisodes ?? it.total_episodes ?? it.eps ?? it.jumlah_episode;
  if (raw == null || raw === "") return undefined;
  return Number.isFinite(raw) ? Number(raw) : raw;
}

export default function EnhancedSlide({ item, index, variant, hoverMode, hoverOpenDelay, hoverCloseDelay }) {
  const [poster, setPoster] = useState(() => item?.src ?? item?.poster ?? item?.image);
  const [posterLoaded, setPosterLoaded] = useState(!!(item?.src ?? item?.poster ?? item?.image));
  
  const name = item?.title ?? item?.name ?? `item ${index + 1}`;
  const age = getAge(item);
  const eps = getEpisodes(item);
  const genre = getFirstGenre(item);

  // Efek untuk mengambil poster dari TMDB jika tidak tersedia
  useEffect(() => {
    console.log("EnhancedSlide data:", { item, name, poster, posterLoaded });
    // Validasi data sebelum diproses
    if (!item) {
      console.error("Item is null or undefined");
      return;
    }
    console.log("Item properties:", Object.keys(item));
    console.log("Item content:", item);
    console.log("Item kategori:", item?.kategori);
    console.log("Item foto_sampul:", item?.foto_sampul);
    console.log("Item src:", item?.src);
    console.log("Item poster:", item?.poster);
    console.log("Item image:", item?.image);
    
    if (!poster && name && item.kategori && !posterLoaded) {
      const fetchTMDBPoster = async () => {
        try {
          console.log("Fetching poster from TMDB for:", name, "kategori:", item.kategori);
          const tmdbPoster = await fetchPosterUrl(name, item.kategori);
          console.log("TMDB poster result:", tmdbPoster);
          if (tmdbPoster) {
            setPoster(tmdbPoster);
          }
          setPosterLoaded(true);
        } catch (error) {
          console.warn('Failed to fetch poster from TMDB for', name, error);
          setPosterLoaded(true);
        }
      };
      
      fetchTMDBPoster();
    } else if ((item.src ?? item.poster ?? item.image) && !posterLoaded) {
      console.log("Using existing poster:", item.src ?? item.poster ?? item.image);
      setPosterLoaded(true);
    }
  }, [poster, name, item?.kategori, posterLoaded]);

  return (
    <SplideSlide key={item.id ?? index}>
      {variant === "poster" ? (
        <HoverCard
          poster={poster}
          title={name}
          age={age}
          episodes={eps}
          genre={genre}
          trigger={hoverMode}
          openDelay={hoverOpenDelay}
          closeDelay={hoverCloseDelay}
        >
          <div className="relative reco-slide rounded-lg overflow-hidden
            transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)]
            group-hover:scale-[1.03]">
            {poster ? (
              <img src={poster} alt={name} className="object-cover select-none" draggable="false" loading="lazy" />
            ) : (
              <div className="bg-gray-700 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </HoverCard>
      ) : (
            <div className="relative w-full h-[162px] overflow-hidden rounded-lg">
              {poster ? (
                <img
                  src={poster}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  draggable="false"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-700 border-2 border-dashed flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {(name || item.rating) && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm line-clamp-1">{name}</div>
                    {item.rating !== undefined && item.rating !== "" && (
                      <div className="flex items-center gap-1 text-xs">
                        <img src="/icon/star.svg" alt="rating" className="size-4" />
                        <span>
                          {typeof item.rating === "string"
                            ? item.rating
                            : `${Number(item.rating).toFixed(1).replace(/\.0$/, "")}/5`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
    </SplideSlide>
  );
}