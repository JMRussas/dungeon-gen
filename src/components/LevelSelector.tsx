// dungeon-gen - LevelSelector Component
//
// Tab buttons to switch the active dungeon level.
//
// Depends on: (none)
// Used by:    App.tsx

interface LevelSelectorProps {
  levels: number;
  activeLevel: number;
  onSelect: (level: number) => void;
}

export function LevelSelector({ levels, activeLevel, onSelect }: LevelSelectorProps) {
  if (levels <= 1) return null;

  return (
    <div className="flex gap-2">
      {Array.from({ length: levels }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            i === activeLevel
              ? "bg-indigo-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
          }`}
        >
          Level {i + 1}
        </button>
      ))}
    </div>
  );
}
