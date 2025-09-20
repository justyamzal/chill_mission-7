import Navbar from "../components/Fragments/Navbar.jsx";
import Hero from "../components/Fragments/Hero.jsx";
import CarouselRow from "../components/Fragments/CarouselRow.jsx";
import Footer from "../components/Fragments/Footer.jsx";

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
  return (
    <div className="min-h-screen w-full bg-[rgba(24,26,28,1)] text-white">
      <Navbar />
      <main>
        <Hero />
        <section className="history-carousel">
            <CarouselRow title="Melanjutkan Tontonan Film" items={historyItems} variant="history" />
        </section>
        <CarouselRow title="Top Rating Film dan Series Hari ini" items={topItems} variant="poster" />
        <CarouselRow title="Film Trending" items={trendItems} variant="poster" />
        <CarouselRow title="Rilis Baru" items={newItems} variant="poster" />
      </main>
      <Footer />
    </div>
  );
}
