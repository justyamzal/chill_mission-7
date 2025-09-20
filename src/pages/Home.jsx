import Navbar from "../components/Fragments/Navbar.jsx";
import Hero from "../components/Fragments/Hero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";
import { useShows } from "../state/shows-context.jsx";

const historyItems = [
  { src: "/content-img/history_1.webp", title: "Dont Look Up", rating: "4.5/5" },
  { src: "/content-img/history_2.webp", title: "All of Us Are Dead", rating: "4.2/5" },
  { src: "/content-img/history_3.webp", title: "Blue Lock", rating: "4.6/5" },
  { src: "/content-img/history_4.webp", title: "A Man Called Otto", rating: "4.9/5" },
  { src: "/content-img/history_1.webp", title: "Dont Look Up", rating: "4.5/5" },
];

const topItems = [
  "/content-img/top_1.webp","/content-img/top_2.webp","/content-img/top_3.webp","/content-img/top_4.webp","/content-img/top_5.webp",
].map((src) => ({ src }));

const trendItems = [
  "/content-img/trend_1.webp","/content-img/trend_2.webp","/content-img/trend_3.webp","/content-img/trend_4.webp","/content-img/trend_5.webp",
].map((src) => ({ src }));

const newItems = [
  "/content-img/new_1.webp","/content-img/new_2.webp","/content-img/new_3.webp","/content-img/new_4.webp","/content-img/new_5.webp",
].map((src) => ({ src }));

export default function Home() {
  const { items } = useShows();
  const toSlide = (s) => ({ src: s.foto_sampul, title: s.nama_tayangan, rating: s.rating });
  const extraHistory  = items.filter(s => s.nominasi === "history").map(toSlide);
  const extraTop      = items.filter(s => s.nominasi === "top").map(toSlide);
  const extraTrending = items.filter(s => s.nominasi === "trending").map(toSlide);
  const extraNew      = items.filter(s => s.nominasi === "new").map(toSlide);
  return (
    <div className="min-h-screen w-full bg-[rgba(24,26,28,1)] text-white">
      <Navbar />
      <main>
        <Hero />
        <section className="history-carousel">
         <CarouselRow title="Melanjutkan Tontonan Film" items={[...extraHistory, ...historyItems]} variant="history" />
        </section>
        <CarouselRow title="Top Rating Film dan Series Hari ini" items={[...extraTop, ...topItems]} />
        <CarouselRow title="Film Trending" items={[...extraTrending, ...trendItems]} />
        <CarouselRow title="Rilis Baru" items={[...extraNew, ...newItems]} />

      </main>
      <Footer />
    </div>
  );
}
