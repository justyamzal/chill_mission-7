// Film.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Fragments/Navbar.jsx";
import FilmHero from "../components/Fragments/FilmHero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShows } from "../state/shows-context.jsx";
import { getLatestMovies, tmdbImg, getMovieGenresMap, genreNameFromIds, getMoviesAgeMap,} from "@/utils/tmdbService.js";

const FILM_GENRES = [
  "Semua","Aksi","Petualangan","Animasi","Komedi","Drama","Fantasi",
  "Horor","Misteri","Romantis","Fiksi Ilmiah","Perang","Thriller","Lainnya"
];

export default function Film() {
  const {items} = useShows();
  const [selectedGenre, setSelectedGenre] = useState("");

  const [latest, setLatest] = useState([]);
  const [errLatest, setErrLatest] = useState("");

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        // 1) ambil list film & peta genre bersamaan
        const [{ results }, genreMap] = await Promise.all([
          getLatestMovies(10, abort.signal),
          getMovieGenresMap(abort.signal),
        ]);
        
        // 2) ambil age
        const ids = results.map(m => m.id).filter(Boolean);
        const ageMap = await getMoviesAgeMap(ids,abort.signal);

        // 3) mapping → isi 'genre' dengan nama Indonesia (bukan id)
        const mapped = results.map((m, i) => ({
          id: m.id ?? `latest-${i}`,
          src: tmdbImg(m.poster_path, "w500"),
          title: m.title || m.original_title || "Tanpa Judul",
          rating: m.vote_average ? Math.round((m.vote_average / 2) * 10) / 10 : "", // 0–5
          genre: genreNameFromIds(m.genre_ids, genreMap) || "Lainnya",
          tahun: m.release_date?.slice(0, 4) ?? "",
          kategori: "film",
          age: ageMap.get(m.id) || "TBD",
        }));
        
        setLatest(mapped);
      } catch (e) {
        // Abaikan error cancel dari StrictMode; tampilkan selain itu
        const canceled =
          e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || e?.message === "canceled";
        if (!canceled) setErrLatest(e?.message || "Gagal memuat latest movies");
      }
    })();
    return () => abort.abort();
  }, []);

  const films = items.filter(
    (s) => s.kategori === "film" && (!selectedGenre || s.genre === selectedGenre)
  );

  const mapHistory = (s, i) => ({
    id: s.id ?? `film-history-${i}`,
    src: s.foto_sampul || "/fallback-poster.webp",
    title: s.nama_tayangan,
    rating: s.rating,
    genre: s.genre || "Lainnya",
    tahun: s.tahun,
    kategori: s.kategori,
  });

  const mapPoster = (s, i) => ({
    id: s.id ?? `film-${i}`,
    src: s.foto_sampul || "/fallback-poster.webp",
    title: s.nama_tayangan,
    rating: s.rating,
    genre: s.genre || "Lainnya",
    tahun: s.tahun,
    kategori: s.kategori,
  });

  const pick = (nominasi, mapper = mapPoster) =>
    films.filter((s) => s.nominasi === nominasi).map(mapper);

  const byNominasi = (nominasi, mapper = mapPoster) =>
    items.filter((s) => s.nominasi === nominasi && s.kategori === "film").map(mapper);

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <FilmHero genres={FILM_GENRES} onGenreChange={setSelectedGenre} />

      <main className="flex flex-col gap-8">
        <CarouselRow
          title={selectedGenre ? `Melanjutkan Tonton Film ${selectedGenre}` : "Melanjutkan Tonton Film"}
          items={pick("history", mapHistory)}
          variant="history"
        />

        {/* Latest Movie: genre sudah nama Indonesia */}
        <CarouselRow title="Latest Movie" items={latest} />
        {errLatest && <div className="px-5 md:px-20 text-red-400">{errLatest}</div>}

        <CarouselRow title="Film Persembahan Chill" items={byNominasi("original")} />
        <CarouselRow
          title={selectedGenre ? `Top Rating Film ${selectedGenre} Hari ini` : "Top Rating Film Hari ini"}
          items={pick("top")}
        />
        <CarouselRow
          title={selectedGenre ? `Film Trending — ${selectedGenre}` : "Film Trending"}
          items={pick("trending")}
        />
        <CarouselRow
          title={selectedGenre ? `Rilis Film Baru — ${selectedGenre}` : "Rilis Baru"}
          items={pick("new")}
        />
      </main>

      <Footer />
    </div>
  );
}
