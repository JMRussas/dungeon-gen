// dungeon-gen - Controls Component
//
// Sliders for grid dimensions and a regenerate button.
//
// Depends on: algorithms/types.ts
// Used by:    App.tsx

import type { MazeConfig } from "../algorithms/types";

interface ControlsProps {
  config: MazeConfig;
  onChange: (config: MazeConfig) => void;
  onGenerate: () => void;
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-zinc-400">
        {label}: <span className="text-white font-medium">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-indigo-500"
      />
    </label>
  );
}

export function Controls({ config, onChange, onGenerate }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Slider
        label="Rows"
        value={config.rows}
        min={2}
        max={8}
        onChange={(rows) => onChange({ ...config, rows })}
      />
      <Slider
        label="Columns"
        value={config.cols}
        min={2}
        max={8}
        onChange={(cols) => onChange({ ...config, cols })}
      />
      <Slider
        label="Levels"
        value={config.levels}
        min={1}
        max={5}
        onChange={(levels) => onChange({ ...config, levels })}
      />
      <button
        onClick={onGenerate}
        className="mt-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Generate
      </button>
    </div>
  );
}
