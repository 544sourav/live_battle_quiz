import { useEffect, useState } from "react";
import { battleModeData } from "../../data/battelmodedata";
import { useSocket } from "../../Socket/socketProvider";
import { BattleModeCard } from "./BattleModeCard";
import { SOCKET_EVENTS } from "../../Socket/socketEvents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MatchSearchModal } from "./MatchSearchModal";

export const BattleMode = () => {
  const socket = useSocket();
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleModeSelect = (mode) => {
    console.log(`Selected mode: ${mode}`);
    if (mode === "Ranked") {
      setIsSearching(true);
      socket.emit(SOCKET_EVENTS.MATCH_FIND, user?.userName);
    }
  };

  useEffect(() => {
    const handleMatchFound = (data) => {
      console.log("Match found:", data);
      setIsSearching(false);
      navigate("/battlespace/" + data.roomId);
    };

    socket.on(SOCKET_EVENTS.MATCH_FOUND, handleMatchFound);

    return () => {
      socket.off(SOCKET_EVENTS.MATCH_FOUND, handleMatchFound);
    };
  }, [socket, navigate]);

  const handleCancelSearch = () => {
    socket.emit(SOCKET_EVENTS.MATCH_CANCEL);
    setIsSearching(false);
  };

  return (
    <div className="bg-cardBackground/95 mt-3 rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-black/20">
      <div>
        <h1 className="text-2xl font-bold text-white">Battle Mode</h1>
        <p className="mt-2 text-gray-400">
          Select a mode and start a new ranked battle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {battleModeData.map((mode) => (
          <BattleModeCard
            key={mode.id}
            data={mode}
            onSelect={handleModeSelect}
          />
        ))}
      </div>

      {isSearching && <MatchSearchModal onCancel={handleCancelSearch} />}
    </div>
  );
};
