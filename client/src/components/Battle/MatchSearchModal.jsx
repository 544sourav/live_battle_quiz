export const MatchSearchModal = ({ onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-cardBackground/95 p-7 shadow-2xl shadow-black/40">
        <h1 className="text-2xl font-bold text-white">
          Searching for a match...
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/40 border-t-transparent" />
        </div>
        <button
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo_hard"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
