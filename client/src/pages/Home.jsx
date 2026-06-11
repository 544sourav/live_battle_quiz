import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-gray-100">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <section className="max-w-2xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Live coding battle arena
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Challenge opponents, improve your rating, and master the
            leaderboard.
          </h1>
          <p className="max-w-xl text-gray-400">
            Jump into fast-paced competitive matches, track your accuracy and
            response time, and grow your skills every round.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo_hard"
              onClick={() => navigate("/auth")}
            >
              Start playing
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-primary hover:bg-white/10"
              onClick={() => navigate("/dashboard")}
            >
              Explore dashboard
            </button>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-cardBackground/80 p-6 shadow-2xl shadow-primary/15 sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/30 opacity-70" />
          <div className="relative space-y-6">
            <div className="rounded-3xl border border-white/10 bg-background/80 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">
                Match ready
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Next challenge starts soon.
              </h2>
              <p className="mt-3 text-gray-400">
                Answer smart, move fast, and earn rating before your opponent
                does.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-background/90 p-5">
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="mt-3 text-2xl font-semibold text-white">92%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-background/90 p-5">
                <p className="text-sm text-gray-400">Average response</p>
                <p className="mt-3 text-2xl font-semibold text-white">8.3s</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-background/90 p-5">
              <p className="text-sm text-gray-400">Rating pulse</p>
              <div className="mt-4 flex items-center justify-between text-white">
                <span className="text-xl font-semibold">1520</span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
                  +24
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          {
            title: "Fast matchmaking",
            description:
              "Pair with opponents in seconds and stay in the flow of the game.",
          },
          {
            title: "Performance tracking",
            description:
              "Monitor accuracy, response time, and win streaks in one place.",
          },
          {
            title: "Earn rating",
            description:
              "Win rounds, climb leaderboards, and showcase your progress.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[1.75rem] border border-white/10 bg-cardBackground/80 p-6 shadow-xl shadow-black/10"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};
