// dungeon-gen - MazeGrid Component
//
// SVG renderer for a single maze level. Draws cell backgrounds
// colored by room type and walls as lines.
//
// Depends on: algorithms/types.ts, hooks/useMazeLayout.ts
// Used by:    App.tsx

import { useMazeLayout } from "../hooks/useMazeLayout";
import type { MazeResult } from "../algorithms/types";

interface MazeGridProps {
  maze: MazeResult;
  activeLevel: number;
}

export function MazeGrid({ maze, activeLevel }: MazeGridProps) {
  const { width, height, padding, cellSize, cells } = useMazeLayout(maze, activeLevel);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[600px] mx-auto"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Outer border */}
      <rect
        x={padding}
        y={padding}
        width={width - padding * 2}
        height={height - padding * 2}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={3}
      />

      {/* Cell backgrounds */}
      {cells.map((c) => (
        <rect
          key={`cell-${c.index}`}
          x={c.x}
          y={c.y}
          width={cellSize}
          height={cellSize}
          fill={c.color}
          opacity={0.3}
        />
      ))}

      {/* Walls */}
      {cells.map((c) => (
        <>
          {c.wallSouth && (
            <line
              key={`wall-s-${c.index}`}
              x1={c.x}
              y1={c.y + cellSize}
              x2={c.x + cellSize}
              y2={c.y + cellSize}
              stroke="#e2e8f0"
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
          {c.wallEast && (
            <line
              key={`wall-e-${c.index}`}
              x1={c.x + cellSize}
              y1={c.y}
              x2={c.x + cellSize}
              y2={c.y + cellSize}
              stroke="#e2e8f0"
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
        </>
      ))}

      {/* Labels */}
      {cells.map((c) => (
        <text
          key={`label-${c.index}`}
          x={c.x + cellSize / 2}
          y={c.y + cellSize / 2 + (c.hasStairs ? -4 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={c.color}
          fontSize="11"
          fontWeight="600"
        >
          {c.roomType}
        </text>
      ))}

      {/* Stair indicators */}
      {cells.map((c) => (
        <>
          {c.stairUp && (
            <text
              key={`stair-up-${c.index}`}
              x={c.x + cellSize / 2}
              y={c.y + cellSize / 2 + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontSize="12"
            >
              ↑
            </text>
          )}
          {c.stairDown && (
            <text
              key={`stair-down-${c.index}`}
              x={c.x + cellSize / 2}
              y={c.y + cellSize / 2 + (c.stairUp ? 22 : 12)}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontSize="12"
            >
              ↓
            </text>
          )}
        </>
      ))}
    </svg>
  );
}
