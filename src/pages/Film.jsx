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
  console.log("Film page items:", items);
  const [selectedGenre, setSelectedGenre] = useState("");

  
  // hanya kategori 'film' + filter genre jika dipilih
  const films = items.filter(
    (s) => s.kategori === "film" && (!selectedGenre || s.genre === selectedGenre)
  );
  console.log("Filtered film items:", films);
  console.log("Total film items:", films.length);

  const mapHistory = (s, i) => {
    console.log(`Processing history item ${i}:`, s);
    const mappedItem = {
      id: s?.id ?? `film-history-${i}`,
      src: s?.foto_sampul,
      title: s?.nama_tayangan,
      rating: s?.rating,
      genre: s?.genre,
      tahun: s?.tahun,
      kategori: s?.kategori,
    };
    console.log(`Mapped history item ${i}:`, mappedItem);
    return mappedItem;
  };
  const mapPoster = (s, i) => {
    console.log(`Processing poster item ${i}:`, s);
    const mappedItem = {
      id: s?.id ?? `film-${i}`,
      src: s?.foto_sampul,
      title: s?.nama_tayangan,
      rating: s?.rating,
      genre: s?.genre,
      tahun: s?.tahun,
      kategori: s?.kategori,
    };
    console.log(`Mapped poster item ${i}:`, mappedItem);
    return mappedItem;
  };

  const pick = (nominasi, mapper = mapPoster) => {
    const filtered = films.filter((s) => s.nominasi === nominasi);
    console.log(`Film items for nominasi ${nominasi}:`, filtered);
    console.log(`Count for nominasi ${nominasi}:`, filtered.length);
    const mappedItems = filtered.map(mapper);
    console.log(`Mapped film items for nominasi ${nominasi}:`, mappedItems);
    return mappedItems;
  };

  // fungsi tambahan untuk filter nominasi berdasarkan kategori
  const byNominasi = (nominasi, mapper = mapPoster) => {
    const filtered = items
      .filter(
        (s) => s.nominasi === nominasi && s.kategori === "film" // filter khusus film
      );
    console.log(`All items for nominasi ${nominasi} (film only):`, filtered);
    console.log(`Count for nominasi ${nominasi} (film only):`, filtered.length);
    const mappedItems = filtered.map(mapper);
    console.log(`Mapped all items for nominasi ${nominasi} (film only):`, mappedItems);
    return mappedItems;
  };


  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
 
      <FilmHero genres={FILM_GENRES} onGenreChange={setSelectedGenre} />

      <main className="flex flex-col gap-8">
        {/* Melanjutkan */}
        <CarouselRow title = {
          selectedGenre ? `Melanjutkan Tonton Film ${selectedGenre}` : "Melanjutkan Tonton Film"}
          items={pick("history", mapHistory)} variant="history"/>

        {/* Film Persembahan Chill — diambil dari nominasi persembahan */}
        <CarouselRow title="Film Persembahan Chill"
          items={byNominasi("original")}/>

        {/* Top Rating */}
        <CarouselRow title={
            selectedGenre ? `Top Rating Film ${selectedGenre} Hari ini` : "Top Rating Film Hari ini"
          }
          items={pick("top")}/>

        {/* Film Trending */}
        <CarouselRow title={selectedGenre ? `Film Trending — ${selectedGenre}` : "Film Trending"}
          items={pick("trending")}/>

        {/* Rilis Baru */}
        <CarouselRow title={selectedGenre ? `Rilis Film Baru — ${selectedGenre}` : "Rilis Baru"}
          items={pick("new")}/>
      </main>

      <Footer />
    </div>
  );
}
