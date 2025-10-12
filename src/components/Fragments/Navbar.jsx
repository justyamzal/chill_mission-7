import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import GenreDropdown from "../Elements/GenreDropdown";

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
      <nav className="flex items-center justify-between ">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-5 md:gap-20 ml-[20px] sm:ml-0">
        {/* desktop logo */}
        <a href="/home" className="hidden md:block">
          <img src="/icon/logo.svg" alt="logo" className="w-[104px]" />
        </a>
        {/* mobile logo */}
        <a href="/home" className="md:hidden !m-0 mr-3 sm:mr-0">
          <img src="/icon/chill-icon.svg" alt="chill" className="block w-6 h-6" />
        </a>
        <ul className="flex items-center gap-3 sm:gap-10 md:gap-20 ml-0">
          <li><a className="hover:text-blue-500 text-sm sm:text-base" href="/series">Series</a></li>
          <li><a className="hover:text-blue-500 text-sm sm:text-base" href="/film">Film</a></li>
          <li><a className="hover:text-blue-500 text-sm sm:text-base" href="/mylist">Daftar Saya</a></li>

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
                <li>
                <Link to="/manage" className="block hover:text-blue-500" onClick={()=>setOpen(false)}><i className="fa-solid fa-gear mr-2" />Manage</Link>
                </li>
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
