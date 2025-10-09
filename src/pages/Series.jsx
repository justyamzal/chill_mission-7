import Navbar from "../components/Fragments/Navbar";
import Hero from "../components/Fragments/Hero";
import CarouselRow from "../components/Fragments/CarouselRow";
import Footer from "../components/Fragments/Footer";
import { useShows } from "../state/shows-context";
import { useState } from "react";


const Series_genre = [
    "Aksi",
    "Anak-anak",
    "Anime",
    "Britania",
    "Drama",
    "Fantasi Ilmiah & Fantasi",
    "Kejahatan",
    "Kdrama",
    "Komedi",
    "Petualangan",
    "Perang",
    "Romantis",
    "Sains & Alam",
    "Thriller",
];

const historySeries = [
  { src: "/content-img/alice_in_borderland.webp", title: "Alice in Borderland", rating: "4.5/5" },
  { src: "/content-img/my_perfect_strangers.webp", title: "My Perfect Strangers", rating: "4.6/5" },
  { src: "/content-img/all_of_us_are_dead.webp", title: "All Of Us Are Dead", rating: "4.2/5" },
  { src: "/content-img/ted_lasso.webp", title: "Ted Lasso", rating: "4.4/5" },
  { src: "/content-img/alice_in_borderland.webp", title: "Alice in Borderland", rating: "4.5/5" },
];


function Series() {
    const { items } = useShows();

    // filter hanya data kategori series
    const seriesItems = items.filter((s) => s.kategori === "series");

    // helper untuk generate array berdasarkan nominasi
    const byNominasi = (nominasi) => seriesItems.filter((s) => s.nominasi === nominasi).map((s, i) => ({
        id: s.id ?? `series-{nominasi}-${i}`,
        src: s.foto_sampul,
        title: s.nama_tayangan,
        rating: s.rating,
    }));

      return (
        <div className="min-h-screen w-full bg-[#181A1C] text-white">
            <Navbar />
            {/* Hero khusus untuk halaman series */}
            <Hero type="series" genres={Series_genre}></Hero>
            
            <main className="flex flex-col gap-8">
                <CarouselRow title="Melanjutkan Tontonan Series" items={byNominasi("history")} variant="history"/>
                <CarouselRow title="Top Rating Series Hari ini" items={byNominasi("top")}/>
                <CarouselRow title="Series Trending" items={byNominasi("trending")}/>
                <CarouselRow title="Rilis Baru" items={byNominasi("new")}/>
            </main>
            <Footer />
        </div>
      );
}
export default Series;