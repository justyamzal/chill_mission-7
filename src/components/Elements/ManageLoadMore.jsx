// src/components/Elements/ManageLoadMore.jsx

export default function ManageLoadMore({ shown, total, onMore }) {
  if (shown >= total) {
    return <p className="text-center text-sm text-white/60 mt-5">Semua data sudah tampil ({total})</p>;
  }
  return (
    <div className="flex justify-center mt-5">
      <button
        onClick={onMore}
        className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-2 text-sm"
      >
        Muat lebih banyak ({shown}/{total})
      </button>
    </div>
  );
}
