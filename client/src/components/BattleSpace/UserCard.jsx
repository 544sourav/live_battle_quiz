import { useSelector } from "react-redux";

export const UserCard = ({ user, score = 0, isCorrect = null }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isCurrentUser = currentUser?._id === user.userId;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-4xl border p-4 transition duration-200 ${
        isCurrentUser
          ? "border-primary/30 bg-primary/10"
          : "border-white/10 bg-secondary/80"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/30 bg-background/80">
            <img
              src={user.imageUrl}
              alt={user.userName}
              className="h-full w-full object-cover"
            />
          </div>
          {isCurrentUser && (
            <div className="absolute -top-2 -right-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              You
            </div>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{user.userName}</p>
          <p className="text-sm text-gray-400">{user.email || "Opponent"}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="rounded-3xl bg-background/80 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Points
          </p>
          <p className="text-2xl font-bold text-primary">{score}</p>
        </div>
        {isCorrect !== null && (
          <div
            className={`rounded-3xl px-3 py-1 text-sm font-semibold ${
              isCorrect
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
            }`}
          >
            {isCorrect ? "Correct" : "Wrong"}
          </div>
        )}
      </div>
    </div>
  );
};
