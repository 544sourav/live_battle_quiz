import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";

const Auth = () => {
  const [mode, setMode] = useState("sign-in");

  return (
    <main className="min-h-screen bg-background text-gray-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_0.95fr] lg:px-8">
        <aside className="hidden flex-col justify-center rounded-[2rem] border border-white/10 bg-secondary/90 p-10 shadow-2xl shadow-primary/10 lg:flex">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-primary">
              Join the arena
            </p>
            <h1 className="max-w-md text-4xl font-semibold text-white sm:text-5xl">
              Sign in and start competing with real opponents.
            </h1>
            <p className="max-w-lg text-base leading-7 text-gray-400">
              One dashboard for battles, stats, rating, and progress. Use the
              same account to keep your performance history.
            </p>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-background/80 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Why compete?
            </p>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li>• Real-time matchups and score tracking</li>
              <li>• Detailed accuracy and response metrics</li>
              <li>• Earn rating and climb the leaderboard</li>
            </ul>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-white/10 bg-cardBackground p-8 shadow-2xl shadow-black/20">
          <div className="mb-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                Secure access
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Access your coding arena
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Sign in or sign up to continue, then start battling friends and
                strangers alike.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-full bg-background/80 p-1">
              <button
                className={`rounded-full py-3 text-sm font-semibold transition ${
                  mode === "sign-in"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMode("sign-in")}
              >
                Sign in
              </button>
              <button
                className={`rounded-full py-3 text-sm font-semibold transition ${
                  mode === "sign-up"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setMode("sign-up")}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/5 bg-background/90 p-4 shadow-inner shadow-white/5">
            {mode === "sign-in" ? (
              <SignIn
                path="/auth"
                routing="path"
                forceRedirectUrl="/dashboard"
              />
            ) : (
              <SignUp
                path="/auth"
                routing="path"
                forceRedirectUrl="/dashboard"
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
