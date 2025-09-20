import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

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
        <section className="w-full px-5 md:px-20 py-5 md:py-10 history-carousel">
          <h3 className="text-2xl md:text-[32px] font-bold pb-5 md:pb-8">Melanjutkan Tontonan Film</h3>
          <Carousel items={historyItems} history />
        </section>
        <Carousel title="Top Rating Film dan Series Hari ini" items={topItems} />
        <Carousel title="Film Trending" items={trendItems} />
        <Carousel title="Rilis Baru" items={newItems} />
      </main>
      <Footer />
    </div>
  );
}
