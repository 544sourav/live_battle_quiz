import { IoFlashSharp } from "react-icons/io5";
import { RxExit } from "react-icons/rx";
import { useEffect, useState } from "react";

export const Header = ({
  timer = 30,
  currentRound = 1,
  totalRounds = 5,
  onExit = () => {},
}) => {
  const [displayTimer, setDisplayTimer] = useState(timer);

  useEffect(() => {
    setDisplayTimer(timer);
  }, [timer]);

  const getTimerColor = () => {
    if (displayTimer <= 5) return "text-red-500";
    if (displayTimer <= 10) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="w-full border-b border-white/10 bg-secondary/90 px-4 py-4 shadow-sm shadow-black/20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IoFlashSharp size={30} className="text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-white">QuizArena</h1>
            <p className="text-sm text-gray-400">Live match arena</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="rounded-3xl border border-white/10 bg-background/70 px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
              Timer
            </p>
            <p className={`mt-1 text-xl font-semibold ${getTimerColor()}`}>
              {displayTimer}s
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="inline-flex items-center justify-center rounded-full bg-danger/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger"
        >
          <RxExit size={18} className="mr-2" />
          Exit
        </button>
      </div>
    </div>
  );
};
