// src/pages/MyList.jsx
import Navbar from "../components/Fragments/Navbar";
import Footer from "../components/Fragments/Footer";
import { useMyListStore } from "../state/myListStore";

export default function MyList() {
  const { items, removeItem } = useMyListStore();

  return (
    <div className="min-h-screen w-full bg-[#181A1C] text-white">
      <Navbar />

      <main className="px-5 md:px-20 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Daftar Saya</h1>
        <p className="text-white/70 mt-2">Kumpulkan tayangan favoritmu di sini.</p>

        {/* My List Items */}
        <section className="mt-10">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">Daftar kamu masih kosong</p>
              <p className="text-gray-500 mt-2">Tambahkan tayangan favoritmu dari halaman lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {items.map((item) => (
                <div key={item.id} className="relative group flex flex-col items-center">
                  <div className="w-[200px] h-[300px] rounded-lg overflow-hidden relative">
                    {item.foto_sampul ? (
                      <img
                        src={item.foto_sampul}
                        alt={item.nama_tayangan}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 rounded-lg">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-10 h-10 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-700 transition-colors"
                      aria-label="hapus dari daftar"
                    >
                      <i className="fa-solid fa-trash" width="20" height="20"></i>
                    </button>
                  </div>
                  
                  <div className="mt-2 text-sm truncate w-[200px] text-center">
                    <p className="font-medium truncate">{item.nama_tayangan}</p>
                    <p className="text-gray-400 text-xs truncate">{item.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
