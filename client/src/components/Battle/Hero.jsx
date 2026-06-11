import { useEffect, useState } from "react";
import { useSocket } from "../../Socket/socketProvider";
import { SOCKET_EVENTS } from "../../Socket/socketEvents";
import hero from "../../assets/hero.png";
import { MdPeople } from "react-icons/md";

export const Hero = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => setOnlineUsers(data);

    socket.on(SOCKET_EVENTS.ONLINE_USER_COUNT, handler);

    return () => {
      socket.off(SOCKET_EVENTS.ONLINE_USER_COUNT, handler);
    };
  }, [socket]);

  return (
    <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-cardBackground/80 shadow-2xl shadow-black/30">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-br from-background/80 via-cardBackground/70 to-background/80" />

      <div className="relative z-10 flex min-h-80 flex-col justify-between p-8 sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">
            Battle Arena
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Challenge opponents in real-time and climb the leaderboard.
          </h1>
          <p className="mt-4 text-gray-300">
            Pick a mode, enter the arena, and improve your accuracy with each
            match.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end mt-3">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-background/70 px-4 py-3">
            <MdPeople size={28} className="text-primary" />
            <div>
              <p className="text-xl font-semibold text-white">{onlineUsers}</p>
              <p className="text-sm text-gray-400">Players online</p>
            </div>
          </div>
          {/* <div className="rounded-3xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              Ready to fight?
            </p>
            <p className="mt-2 text-white">
              Choose a mode below and jump into a ranked match.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
