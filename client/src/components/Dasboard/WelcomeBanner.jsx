import { useSelector } from "react-redux";
import { RiShieldFlashFill } from "react-icons/ri";

export const WelcomeBanner = () => {
  const user = useSelector((state) => state.auth.user);

  const winRate = user?.matchesPlayed
    ? Math.round((user.wins / user.matchesPlayed) * 100)
    : 0;

  return (
    <div className="rounded-4xl border border-indigo-500/10 bg-slate-950 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Welcome back,
            <span className="block max-w-full truncate text-4xl font-semibold text-white sm:text-5xl">
              {user?.userName || "Champion"}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Track your progress, view recent battles, and stay ready for the
            next match. Your competitive profile is stronger with every game.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:w-auto">
          <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/80 p-5 shadow-[0_18px_40px_rgba(99,102,241,0.12)]">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Current Rating
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {user?.rating || "N/A"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Competitive ranking across battles
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/80 p-5 shadow-[0_18px_40px_rgba(99,102,241,0.12)]">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Win Rate
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">{winRate}%</p>
            <p className="mt-2 text-sm text-slate-400">
              Based on completed matches
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
