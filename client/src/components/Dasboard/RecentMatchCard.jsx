export const RecentMatchCard = ({ match, userData }) => {
  const currentPlayer = match.players.find(
    (player) => player.user?._id === userData?._id,
  );

  const opponentPlayer = match.players.find(
    (player) => player.user?._id !== userData?._id,
  );

  const opponent = opponentPlayer?.user;

  const matchResult = !match.winner
    ? "Draw"
    : match.winner.toString() === userData._id.toString()
      ? "Win"
      : "Loss";

  const color =
    matchResult === "Draw"
      ? "bg-gray-500"
      : matchResult === "Win"
        ? "bg-green-500"
        : "bg-red-500";

  const userScore = currentPlayer?.score || 0;
  const opponentScore = opponentPlayer?.score || 0;

  const matchDate = new Date(match.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col mt-1 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-indigo-500/20 bg-slate-950/80 text-white">
      {/* left section */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={opponent?.imageUrl}
          alt={opponent?.userName}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />

        <div className="min-w-0">
          <p className="font-semibold truncate">{opponent?.userName}</p>

          <p className="text-sm text-gray-400">Rating: {opponent?.rating}</p>
        </div>
      </div>

      {/* right section */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
        {/* result */}
        <div
          className={`${color} px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {matchResult}
        </div>

        {/* score */}
        <div className="text-lg font-bold whitespace-nowrap">
           {opponentScore} - {userScore}
        </div>

        {/* match details */}
        <div className="text-right whitespace-nowrap">
          <p className="text-sm">{match.matchType} Battle</p>

          <p className="text-xs text-gray-500">{matchDate}</p>
        </div>
      </div>
    </div>
  );
};
