export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full max-h-[587px] h-[60vh] md:h-[587px] bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-img/bg-hero.svg')" }}
    >
      <div className="absolute inset-0 flex flex-col gap-5 px-5 md:px-20 pt-20 md:pt-[287px]">
        <h1 className="text-3xl md:text-5xl font-bold">Duty After School</h1>
        <p className="max-w-[668px] text-base md:text-lg text-zinc-200">
          Sebuah benda tak dikenal mengambil alih dunia. Dalam keputusasaan,
          Departemen Pertahanan mulai merekrut lebih banyak tentara, termasuk siswa sekolah menengah.
          Mereka pun segera menjadi pejuang garis depan dalam perang.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <button className="rounded-full bg-[rgba(15,30,147,1)] px-4 md:px-6 py-2 text-sm md:text-base font-bold">Mulai</button>
            <button className="rounded-full bg-[rgba(34,40,42,1)] px-4 md:px-6 py-2 text-sm md:text-base font-bold flex items-center gap-2">
              <img src="/icon/info.svg" alt="" className="w-5 h-5" />
              <span>Selengkapnya</span>
            </button>
            <span className="flex items-center justify-center rounded-full border border-zinc-400/80 w-[52px] h-[45px] text-sm">
              18+
            </span>
          </div>

          <div className="hidden md:block">
            <img src="/icon/volume-off.svg" alt="mute" />
          </div>
        </div>
      </div>
    </section>
  );
}
