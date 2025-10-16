import Navbar from "../components/Fragments/Navbar";
import SeriesHero from "../components/Fragments/SeriesHero";
import CarouselRow from "../components/Fragments/CarouselRow";
import Footer from "../components/Fragments/Footer";
import { useShows } from "../state/shows-context";

function Series() {
  const { items, loading } = useShows();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#181A1C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Memuat data series...</p>
        </div>
      </div>
    );
  }

  const seriesItems = items.filter((s) => s.kategori === "series");

  const byNominasi = (nominasi) =>
    seriesItems
      .filter((s) => s.nominasi === nominasi && s.kategori === "series")
      .map((s, i) => ({
        id: s.id ?? `series-${nominasi}-${i}`,
        src: s.foto_sampul,
        title: s.nama_tayangan,
        rating: s.rating,
        genre: s.genre,
        tahun: s.tahun,
        kategori: s.kategori,
      }));

 return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

    <SeriesHero
           genres={[
             "Aksi","Anak-anak","Anime","Britania","Drama","Fantasi & Fiksi Ilmiah",
             "Kejahatan","KDrama","Komedi","Petualangan","Perang","Romantis",
             "Sains & Alam","Thriller"
           ]}
     />

      <main className="flex flex-col gap-8">
        <CarouselRow title="Melanjutkan Tontonan Series" items={byNominasi("history")} variant="history" />
        <CarouselRow title="Series Persembahan Chill" items={byNominasi("original")} variant="poster"/>
        <CarouselRow title="Top Rating Series Hari ini" items={byNominasi("top")} />
        <CarouselRow title="Series Trending" items={byNominasi("trending")} />
        <CarouselRow title="Rilis Baru" items={byNominasi("new")} />
      </main>

      <Footer />
    </div>
  );
}

export default Series;
