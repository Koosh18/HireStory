export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade" onClick={onClose} />
      <div className="relative z-10 w-[95vw] sm:w-[700px] max-h-[85vh] overflow-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border p-5 animate-pop">
        {title && <div className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</div>}
        {children}
        <div className="mt-4 text-right">
          <button className="px-4 py-2 rounded bg-gray-900 text-white hover:opacity-90" onClick={onClose}>Close</button>
        </div>
      </div>
      <style>{`
        .animate-fade{animation:fade .2s ease}
        .animate-pop{animation:pop .2s ease}
        @keyframes fade{from{opacity:0}to{opacity:1}}
        @keyframes pop{from{transform:translateY(8px) scale(.98);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
      `}</style>
    </div>
  );
}



