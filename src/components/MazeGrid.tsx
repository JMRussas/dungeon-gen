// dungeon-gen - MazeGrid Component
//
// SVG renderer for a single maze level. Draws cell backgrounds
// colored by room type and walls as lines.
//
// Depends on: algorithms/types.ts
// Used by:    App.tsx

import type { ReactNode } from "react";
import {
  type MazeResult,
  RoomType,
  ROOM_COLORS,
  cellIndex,
  wallKey,
} from "../algorithms/types";

const CELL_SIZE = 64;
const WALL_WIDTH = 3;
const PADDING = 2;

interface MazeGridProps {
  maze: MazeResult;
  activeLevel: number;
}

export function MazeGrid({ maze, activeLevel }: MazeGridProps) {
  const { config, removedWalls, cellTypes } = maze;
  const { rows, cols, levels } = config;

  const width = cols * CELL_SIZE + PADDING * 2;
  const height = rows * CELL_SIZE + PADDING * 2;

  // Determine which cells have vertical connections (stairs)
  const hasStairUp = new Set<number>();
  const hasStairDown = new Set<number>();

  if (levels > 1) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = cellIndex(config, activeLevel, row, col);
        // Check connection to level above
        if (activeLevel < levels - 1) {
          const above = cellIndex(config, activeLevel + 1, row, col);
          if (removedWalls.has(wallKey(cell, above))) {
            hasStairUp.add(cell);
          }
        }
        // Check connection to level below
        if (activeLevel > 0) {
          const below = cellIndex(config, activeLevel - 1, row, col);
          if (removedWalls.has(wallKey(cell, below))) {
            hasStairDown.add(cell);
          }
        }
      }
    }
  }

  const cells: ReactNode[] = [];
  const walls: ReactNode[] = [];
  const labels: ReactNode[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = cellIndex(config, activeLevel, row, col);
      const roomType = cellTypes.get(cell) ?? RoomType.Combat;
      const x = PADDING + col * CELL_SIZE;
      const y = PADDING + row * CELL_SIZE;

      // Cell background
      cells.push(
        <rect
          key={`cell-${cell}`}
          x={x}
          y={y}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={ROOM_COLORS[roomType]}
          opacity={0.3}
        />
      );

      // Room type label
      labels.push(
        <text
          key={`label-${cell}`}
          x={x + CELL_SIZE / 2}
          y={y + CELL_SIZE / 2 + (hasStairUp.has(cell) || hasStairDown.has(cell) ? -4 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={ROOM_COLORS[roomType]}
          fontSize="11"
          fontWeight="600"
        >
          {roomType}
        </text>
      );

      // Stair indicators
      if (hasStairUp.has(cell)) {
        labels.push(
          <text
            key={`stair-up-${cell}`}
            x={x + CELL_SIZE / 2}
            y={y + CELL_SIZE / 2 + 12}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#e2e8f0"
            fontSize="12"
          >
            ↑
          </text>
        );
      }
      if (hasStairDown.has(cell)) {
        labels.push(
          <text
            key={`stair-down-${cell}`}
            x={x + CELL_SIZE / 2}
            y={y + CELL_SIZE / 2 + (hasStairUp.has(cell) ? 22 : 12)}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#e2e8f0"
            fontSize="12"
          >
            ↓
          </text>
        );
      }

      // South wall
      if (row < rows - 1) {
        const neighbor = cellIndex(config, activeLevel, row + 1, col);
        const key = wallKey(cell, neighbor);
        if (!removedWalls.has(key)) {
          walls.push(
            <line
              key={`wall-s-${cell}`}
              x1={x}
              y1={y + CELL_SIZE}
              x2={x + CELL_SIZE}
              y2={y + CELL_SIZE}
              stroke="#e2e8f0"
              strokeWidth={WALL_WIDTH}
              strokeLinecap="round"
            />
          );
        }
      }

      // East wall
      if (col < cols - 1) {
        const neighbor = cellIndex(config, activeLevel, row, col + 1);
        const key = wallKey(cell, neighbor);
        if (!removedWalls.has(key)) {
          walls.push(
            <line
              key={`wall-e-${cell}`}
              x1={x + CELL_SIZE}
              y1={y}
              x2={x + CELL_SIZE}
              y2={y + CELL_SIZE}
              stroke="#e2e8f0"
              strokeWidth={WALL_WIDTH}
              strokeLinecap="round"
            />
          );
        }
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[600px] mx-auto"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* Outer border */}
      <rect
        x={PADDING}
        y={PADDING}
        width={cols * CELL_SIZE}
        height={rows * CELL_SIZE}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={WALL_WIDTH}
      />
      {cells}
      {walls}
      {labels}
    </svg>
  );
}
