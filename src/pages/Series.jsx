import Navbar from "../components/Fragments/Navbar";
import SeriesHero from "../components/Fragments/SeriesHero";
import CarouselRow from "../components/Fragments/CarouselRow";
import Footer from "../components/Fragments/Footer";
import { useShows } from "../state/shows-context";

function Series() {
  const { items } = useShows();
  console.log("Series page items:", items);

  const seriesItems = items.filter((s) => s.kategori === "series");
  console.log("Filtered series items:", seriesItems);
  console.log("Total series items:", seriesItems.length);

  const byNominasi = (nominasi) => {
    const filtered = seriesItems
      .filter((s) => s.nominasi === nominasi && s.kategori === "series");
    console.log(`Items for nominasi ${nominasi}:`, filtered);
    console.log(`Count for nominasi ${nominasi}:`, filtered.length);
    const mappedItems = filtered.map((s, i) => {
      // Validasi field-field penting sebelum mapping
      console.log(`Processing series item ${i}:`, s);
      const mappedItem = {
        id: s?.id ?? `series-${nominasi}-${i}`,
        src: s?.foto_sampul,
        title: s?.nama_tayangan,
        rating: s?.rating,
        genre: s?.genre,
        tahun: s?.tahun,
        kategori: s?.kategori,
      };
      console.log(`Mapped item ${i} for ${nominasi}:`, mappedItem);
      return mappedItem;
    });
    console.log(`Mapped items for nominasi ${nominasi}:`, mappedItems);
    return mappedItems;
  };

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
