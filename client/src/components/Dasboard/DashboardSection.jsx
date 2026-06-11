/* eslint-disable no-unused-vars */
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsCards } from "./StatsCards";
import { statsData } from "../../data/statsdata";
import { useSelector } from "react-redux";
import { RecentMatchs } from "./RecentMatches";

export const DashboardSection = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-background text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <WelcomeBanner />

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="grid gap-6 lg:grid-cols-2">
            {statsData.map((stats) => (
              <StatsCards user={user} stats={stats} key={stats.id} />
            ))}
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-indigo-500/10 bg-darkblue p-6 shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Your battle pulse
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">
                    Performance overview
                  </h2>
                </div>
                <div className="rounded-3xl bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100">
                  Updated live
                </div>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Win Rate</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {user?.matchesPlayed
                      ? `${Math.round((user?.wins / user.matchesPlayed) * 100)}%`
                      : "0%"}
                  </p>
                </div>
                <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Best Streak</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {user?.currentStreak || 0}
                  </p>
                </div>
                <div className="rounded-3xl border border-indigo-500/20 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">Average Response</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {user?.averageResponseTime
                      ? `${user.averageResponseTime.toFixed(1)}s`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
          <RecentMatchs />

          <div className="rounded-3xl border border-indigo-500/10 bg-darkblue p-6 shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Quick actions
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Start a new battle
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-slate-950/70 p-5 border border-indigo-500/15">
                <p className="text-sm text-slate-400">
                  Explore your next challenge
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Find opponents, review your stats, and sharpen your skills.
                </p>
              </div>
              <div className="rounded-3xl bg-indigo-500 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.3em]">Focus</p>
                <p className="mt-2 text-xl font-semibold">
                  Stay sharp with daily battle practice
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-5 border border-indigo-500/15">
                <p className="text-sm text-slate-400">Need a boost?</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Review your recent matches and improve accuracy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
