import { Hero } from "../components/Battle/Hero.jsx";
import { BattleMode } from "../components/Battle/BattleMode.jsx";

export const Battle = () => {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Hero />
        <div className="mt-8">
          <BattleMode />
        </div>
      </div>
    </div>
  );
};
