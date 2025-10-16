// src/pages/Film.jsx
import { useEffect } from "react";
import Navbar from "../components/Fragments/Navbar.jsx";
import FilmHero from "../components/Fragments/FilmHero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShowStore } from "../state/showStore";
import { useOverridesStore } from "../state/overridesStore"; // opsional

const FILM_GENRES = [
  "Aksi","Petualangan","Animasi","Komedi","Drama","Fantasi",
  "Horor","Misteri","Romantis","Fiksi Ilmiah","Perang","Thriller",
];

export default function Film() {
  const {
    loading, error, preloadGenres, fetchMovieRows,
    movieRecommended, movieRated, moviePopular, movieTrending, movieUpcoming,
  } = useShowStore();

  const { getPatched } = useOverridesStore(); // opsional

  useEffect(() => {
    (async () => {
      await preloadGenres();
      await fetchMovieRows();
    })();
  }, [preloadGenres, fetchMovieRows]);

  const patchAll = (arr) => arr.map(getPatched); // opsional

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <FilmHero genres={FILM_GENRES} onGenreChange={() => {}} />

      {error && <div className="px-6 md:px-12 lg:px-24 py-4 text-red-400">{error}</div>}

      <main className="flex flex-col gap-8">
        <CarouselRow title="Recommended Movies" items={patchAll(movieRecommended)} />
        {!!movieRated.length && <CarouselRow title="Rated Movies (Guest Session)" items={patchAll(movieRated)} />}
        <CarouselRow title="Popular Movies" items={patchAll(moviePopular)} />
        <CarouselRow title="Trending Movies (Today)" items={patchAll(movieTrending)} />
        <CarouselRow title="Upcoming Films" items={patchAll(movieUpcoming)} />
      </main>

      {loading && <div className="px-6 md:px-12 lg:px-24 py-4 text-gray-400">Loading…</div>}
      <Footer />
    </div>
  );
}

