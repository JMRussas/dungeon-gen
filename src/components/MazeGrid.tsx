// dungeon-gen - MazeGrid Component
//
// SVG renderer for a single maze level. Draws cell backgrounds
// colored by room type and walls as lines.
//
// Depends on: hooks/useMazeLayout.ts
// Used by:    App.tsx

import { Fragment } from "react";
import { useMazeLayout } from "../hooks/useMazeLayout";
import { SVG } from "../algorithms/types";
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
      role="img"
      aria-label={`Maze level ${activeLevel + 1} of ${maze.config.levels}`}
    >
      {/* Outer border */}
      <rect
        x={padding}
        y={padding}
        width={width - padding * 2}
        height={height - padding * 2}
        fill="none"
        stroke={SVG.WALL_COLOR}
        strokeWidth={SVG.WALL_WIDTH}
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
          opacity={SVG.CELL_OPACITY}
        />
      ))}

      {/* Walls */}
      {cells.map((c) => (
        <Fragment key={`walls-${c.index}`}>
          {c.wallSouth && (
            <line
              x1={c.x}
              y1={c.y + cellSize}
              x2={c.x + cellSize}
              y2={c.y + cellSize}
              stroke={SVG.WALL_COLOR}
              strokeWidth={SVG.WALL_WIDTH}
              strokeLinecap="round"
            />
          )}
          {c.wallEast && (
            <line
              x1={c.x + cellSize}
              y1={c.y}
              x2={c.x + cellSize}
              y2={c.y + cellSize}
              stroke={SVG.WALL_COLOR}
              strokeWidth={SVG.WALL_WIDTH}
              strokeLinecap="round"
            />
          )}
        </Fragment>
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
          fontSize={SVG.LABEL_SIZE}
          fontWeight="600"
        >
          {c.roomType}
        </text>
      ))}

      {/* Stair indicators */}
      {cells.map((c) => (
        <Fragment key={`stairs-${c.index}`}>
          {c.stairUp && (
            <text
              x={c.x + cellSize / 2}
              y={c.y + cellSize / 2 + SVG.STAIR_SIZE}
              textAnchor="middle"
              dominantBaseline="central"
              fill={SVG.WALL_COLOR}
              fontSize={SVG.STAIR_SIZE}
            >
              ↑
            </text>
          )}
          {c.stairDown && (
            <text
              x={c.x + cellSize / 2}
              y={c.y + cellSize / 2 + (c.stairUp ? SVG.STAIR_SIZE + 10 : SVG.STAIR_SIZE)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={SVG.WALL_COLOR}
              fontSize={SVG.STAIR_SIZE}
            >
              ↓
            </text>
          )}
        </Fragment>
      ))}
    </svg>
  );
}
