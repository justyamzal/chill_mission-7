import Navbar from "../components/Fragments/Navbar.jsx";
import FilmHero from "../components/Fragments/FilmHero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShows } from "../state/shows-context.jsx";
import { useState } from "react";

// daftar genre film (silakan sesuaikan)
const FILM_GENRES = [
  "Aksi","Petualangan","Animasi","Komedi","Drama","Fantasi",
  "Horor","Misteri","Romantis","Fiksi Ilmiah","Perang","Thriller",
];

export default function Film() {
  const { items } = useShows();
  const [selectedGenre, setSelectedGenre] = useState("");

  // hanya kategori 'film' + filter genre jika dipilih
  const films = items.filter(
    (s) => s.kategori === "film" && (!selectedGenre || s.genre === selectedGenre)
  );

  const mapHistory = (s, i) => ({
    id: s.id ?? `film-history-${i}`,
    src: s.foto_sampul,
    title: s.nama_tayangan,
    rating: s.rating,
  });
  const mapPoster = (s, i) => ({
    id: s.id ?? `film-${i}`,
    src: s.foto_sampul,
    title: s.nama_tayangan,
    rating: s.rating,
  });

  const pick = (nominasi, mapper = mapPoster) =>
    films.filter((s) => s.nominasi === nominasi).map(mapper);

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
        <CarouselRow
          title={selectedGenre ? `Film Persembahan Chill — ${selectedGenre}` : "Film Persembahan Chill"}
          items={pick("top")}
        />
        <CarouselRow
          title={selectedGenre ? `Top Rating Film ${selectedGenre} Hari ini` : "Top Rating Film Hari ini"}
          items={pick("rating")}
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
