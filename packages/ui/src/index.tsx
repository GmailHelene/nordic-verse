export function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-nordic-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400"
    >
      {label}
    </button>
  );
}
