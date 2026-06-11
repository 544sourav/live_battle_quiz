export const ProfileHeader = ({ user }) => {
  const initials = user?.userName
    ? user.userName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PL";

  return (
    <div className="rounded-3xl border border-white/10 bg-secondary/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-4xl font-bold text-primary">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.userName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">Welcome back</p>
            <h1 className="text-3xl font-bold text-white">
              {user?.userName || "Player"}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              This is your personal competitive profile.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-background/80 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
              Player ID
            </p>
            <p className="mt-2 text-xl font-semibold text-white break-all">
              {user?.playerId || user?._id}
            </p>
          </div>
          <div className="rounded-3xl bg-background/80 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
              Email
            </p>
            <p className="mt-2 text-xl font-semibold text-white break-all">
              {user?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
