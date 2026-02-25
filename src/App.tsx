// dungeon-gen - App
//
// Root component: wires together maze generation, room assignment,
// and all UI components.
//
// Depends on: algorithms/*, components/*
// Used by:    main.tsx

import { useState, useCallback, useMemo } from "react";
import type { MazeConfig, MazeResult } from "./algorithms/types";
import { generateMaze } from "./algorithms/maze";
import { assignRoomTypes } from "./algorithms/rooms";
import { MazeGrid } from "./components/MazeGrid";
import { LevelSelector } from "./components/LevelSelector";
import { Controls } from "./components/Controls";
import { Legend } from "./components/Legend";

const DEFAULT_CONFIG: MazeConfig = { rows: 4, cols: 4, levels: 3 };

function buildMaze(config: MazeConfig): MazeResult {
  const removedWalls = generateMaze(config);
  const cellTypes = assignRoomTypes(config, removedWalls);
  return { config, removedWalls, cellTypes };
}

export default function App() {
  const [config, setConfig] = useState<MazeConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState(0); // bump to force regeneration
  const [activeLevel, setActiveLevel] = useState(0);

  const maze = useMemo(() => buildMaze(config), [config, seed]);

  const handleGenerate = useCallback(() => {
    setSeed((s) => s + 1);
    setActiveLevel(0);
  }, []);

  const handleConfigChange = useCallback((newConfig: MazeConfig) => {
    setConfig(newConfig);
    setActiveLevel(0);
    setSeed((s) => s + 1);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">dungeon-gen</h1>
          <p className="text-zinc-400 mt-1">
            Interactive dungeon generator using Kruskal's maze algorithm.
            Ported from a{" "}
            <a
              href="https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Verse
            </a>
            {" "}dungeon crawler built in UEFN.
          </p>
        </div>

        {/* Main layout: controls + grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar: controls */}
          <div className="w-full md:w-56 shrink-0">
            <Controls
              config={config}
              onChange={handleConfigChange}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Maze area */}
          <div className="flex-1 flex flex-col gap-4 items-center">
            <LevelSelector
              levels={config.levels}
              activeLevel={activeLevel}
              onSelect={setActiveLevel}
            />
            <MazeGrid maze={maze} activeLevel={activeLevel} />
          </div>
        </div>

        {/* Legend */}
        <Legend />
      </div>
    </div>
  );
}
