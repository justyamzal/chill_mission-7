import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const refWrap = useRef(null);


  useEffect(() => {

    function onDocClick(e) {
      if (!refWrap.current) return;
      if (!refWrap.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="w-full px-5 md:px-20 py-3 md:py-6 relative z-50">
      <nav className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-5 md:gap-20">
          {/* desktop logo */}
          <img src="/icon/logo.svg" alt="logo" className="hidden md:block w-[104px]" />
          {/* mobile logo */}
          <img src="/icon/chill-icon.svg" alt="chill" className="block md:hidden w-6 h-6" />

          <ul className="hidden md:flex items-center gap-20">
            <li><a className="hover:text-blue-500" href="#">Series</a></li>
            <li><a className="hover:text-blue-500" href="#">Film</a></li>
            <li><a className="hover:text-blue-500" href="#">Daftar Saya</a></li>
          </ul>
        </div>

        {/* Right */}
        <div className="relative" ref={refWrap}>
          <button
            className="flex items-center gap-2"
            onClick={() => setOpen((v) => !v)}
          >
            <img src="/icon/avatar_profile.png" alt="avatar" className="w-10 h-10 rounded-full" />
            <img src="/icon/vector_arrow.svg" alt="" className="hidden md:block" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-40 rounded border border-blue-600 bg-[rgba(24,26,28,1)] p-4 text-sm shadow-lg z-10">
              <ul className="flex flex-col gap-4">
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-user mr-2" />Profil Saya</li>
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-star mr-2" />Ubah Premium</li>
                <li className="cursor-pointer hover:text-blue-500"><i className="fa-solid fa-right-from-bracket mr-2" />Keluar</li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
