// src/components/Elements/Badge.jsx
export default function Badge({ children, className="" }) {
  return <span className={["inline-flex items-center justify-center rounded-2xl border border-white/40 text-sm px-2 py-1",className].join(" ")}>{children}</span>;
}