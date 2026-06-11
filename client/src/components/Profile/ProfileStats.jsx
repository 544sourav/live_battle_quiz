const statCards = [
  { label: "Rating", key: "rating", suffix: "pts" },
  { label: "Matches Played", key: "matchesPlayed" },
  { label: "Wins", key: "wins" },
  { label: "Losses", key: "losses" },
  { label: "Accuracy", key: "averageAccuracy", suffix: "%" },
  { label: "Response Time", key: "averageResponseTime", suffix: "ms" },
];

export const ProfileStats = ({ user }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-secondary/20 p-6">
      <h2 className="text-xl font-semibold text-white">Competitive Stats</h2>
      <p className="mt-2 text-sm text-gray-400">
        Your recent game performance and rank metrics.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {statCards.map((stat) => {
          const value = user?.[stat.key] ?? 0;
          return (
            <div key={stat.key} className="rounded-3xl bg-background/80 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {value}
                {stat.suffix ? stat.suffix : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
