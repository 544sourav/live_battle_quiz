import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getMatch_by_userid } from "../../services/operations/match";
import { Loading } from "../core/Loading";
import { RecentMatchCard } from "./RecentMatchCard";
import { useSelector } from "react-redux";

export const RecentMatchs = () => {
  const [recentMatches, setRecentMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);

        const token = await getToken();
        const data = await getMatch_by_userid(token);

        setRecentMatches(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [getToken]);

  return (
    <div className="rounded-4xl border border-indigo-500/10 bg-darkblue p-5 shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between gap-4 border-b border-indigo-500/10 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Recent Activity
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Recent Matches
          </h2>
        </div>
        <NavLink
          to="/battle"
          className="text-sm font-medium text-indigo-300 transition hover:text-white"
        >
          View all
        </NavLink>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="py-10">
            <Loading />
          </div>
        ) : !recentMatches || recentMatches.length === 0 ? (
          <div className="rounded-3xl bg-slate-950/80 p-8 text-center text-slate-400">
            No recent matches yet. Start a battle to see your activity here.
          </div>
        ) : (
          recentMatches
            .slice(0, 5)
            .map((match) => (
              <RecentMatchCard key={match._id} match={match} userData={user} />
            ))
        )}
      </div>
    </div>
  );
};
