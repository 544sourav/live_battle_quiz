export const BattleModeCard = ({ data, onSelect }) => {
  const Icon = data.icon;
  return (
    <div
      onClick={() => onSelect(data.type)}
      className={`flex flex-col items-center p-6 rounded-lg border border-white/10 bg-secondary/90 text-white shadow-lg shadow-black/20 cursor-pointer transition duration-300 hover:border-primary hover:bg-cardBackground/95`}
    >
      <div
        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ${data.background}`}
      >
        <Icon size={40} className={data.color} />
      </div>

      <h2 className="text-xl font-bold">{data.title}</h2>
      <p className="mt-3 text-center text-sm text-gray-400">
        {data.description}
      </p>
    </div>
  );
};
