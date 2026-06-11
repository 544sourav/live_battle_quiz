export const StatsCards = ({ stats, user }) => {
  const Icon = stats.icon;
  const fieldValue = user?.[stats.field];
  const formattedValue =
    typeof fieldValue === "number"
      ? stats.field === "averageAccuracy"
        ? `${(fieldValue * 100).toFixed(1)}%`
        : stats.field === "averageResponseTime"
          ? `${fieldValue.toFixed(1)}s`
          : Number(fieldValue).toLocaleString()
      : "0";

  return (
    <div className="rounded-3xl border border-indigo-500/10 bg-darkblue p-5 shadow-[0_20px_60px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{stats.heading}</p>
          <p className="mt-3 text-4xl font-semibold text-white">
            {formattedValue}
          </p>
        </div>
        <div
          style={{ backgroundColor: stats.color }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stats.shadow}`}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
};
