// src/pages/Series.jsx
import { useEffect } from "react";
import Navbar from "../components/Fragments/Navbar";
import SeriesHero from "../components/Fragments/SeriesHero";
import CarouselRow from "../components/Fragments/CarouselRow";
import Footer from "../components/Fragments/Footer";
import { useShowStore } from "../state/showStore";
import { useOverridesStore } from "../state/overridesStore"; // opsional

const SERIES_GENRES = [
  "Aksi","Anak-anak","Anime","Britania","Drama","Fantasi & Fiksi Ilmiah",
  "Kejahatan","KDrama","Komedi","Petualangan","Perang","Romantis",
  "Sains & Alam","Thriller",
];

export default function Series() {
  const {
    loading, error, preloadGenres, fetchTVRows,
    tvRecommended, tvRated, tvPopular, tvTrending, tvAiringToday,
  } = useShowStore();

  const { getPatched } = useOverridesStore(); // opsional

  useEffect(() => {
    (async () => {
      await preloadGenres();
      await fetchTVRows();
    })();
  }, [preloadGenres, fetchTVRows]);

  const patchAll = (arr) => arr.map(getPatched); // opsional

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />
      <SeriesHero genres={SERIES_GENRES} />

      {error && <div className="px-6 md:px-12 lg:px-24 py-4 text-red-400">{error}</div>}

      <main className="flex flex-col gap-8">
        <CarouselRow title="Recommended TV" items={patchAll(tvRecommended)} />
        {!!tvRated.length && <CarouselRow title="TV Rated (Guest Session)" items={patchAll(tvRated)} />}
        <CarouselRow title="Popular TV" items={patchAll(tvPopular)} />
        <CarouselRow title="Trending TV (Today)" items={patchAll(tvTrending)} />
        <CarouselRow title="TV Airing Today" items={patchAll(tvAiringToday)} />
      </main>

      {loading && <div className="px-6 md:px-12 lg:px-24 py-4 text-gray-400">Loading…</div>}
      <Footer />
    </div>
  );
}
